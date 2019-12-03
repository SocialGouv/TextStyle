/* eslint-disable no-console */
const express = require("express");
const next = require("next");
const proxyMiddleware = require("http-proxy-middleware");

const ELASTIC_URL = process.env.ELASTIC_URL || "http://127.0.0.1:9210";
const GRAPHQL_URL = process.env.GRAPHQL_URL || "http://127.0.0.1:8082";
const PORT = parseInt(process.env.PORT, 10) || 3000;
const NODE_ENV = process.env.NODE_ENV;

const proxies = {
  "/elastic": {
    target: ELASTIC_URL,
    pathRewrite: { "^/elastic": "/" },
    changeOrigin: true
  },
  "/graphql-engine": {
    target: GRAPHQL_URL,
    pathRewrite: { "^/graphql-engine": "/" },
    changeOrigin: true
  }
};

const dev = NODE_ENV !== "production";
const app = next({
  dev
});

const handle = app.getRequestHandler();

let server;
app
  .prepare()
  .then(() => {
    server = express();

    // Set up the proxy.
    Object.keys(proxies).forEach(function(context) {
      server.use(proxyMiddleware(context, proxies[context]));
    });

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all("*", (req, res) => handle(req, res));

    server.listen(PORT, err => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on http://127.0.0.1:${PORT} [${NODE_ENV}]`);
    });
  })
  .catch(err => {
    console.log("An error occurred, unable to start the server");
    console.log(err);
  });
