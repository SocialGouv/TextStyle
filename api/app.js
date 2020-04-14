/**
 * Module dependencies.
 */

const express = require("express");
const chalk = require("chalk");
// const dotenv = require('dotenv');
const passport = require("passport");
const cors = require("cors");
const expressValidator = require("express-validator");

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
// dotenv.load({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
const userController = require("./controllers/user");
const dilaController = require("./controllers/dila");

const app = express();

/**
 * Express configuration.
 */
app.set("host", "0.0.0.0");
app.set("port", process.env.PORT || 8080);
app.set("json spaces", 2); // number of spaces for indentation
app.use(cors());
app.use(express.json());
//app.use(bodyParser.json());
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());

app.get("/webhook", userController.getWebhook);
app.get("/jwks", userController.getJwks);

app.get("/dila/ping", dilaController.pingSearch);
app.post("/dila/search", dilaController.dilaSearch);
app.post("/dila/article", dilaController.dilaGetArticle);

app
  .use(express.urlencoded({ extended: true }))
  .post("/verif", passport.authenticate("easy"), function() {
    // The user has been emailed.
    // Possible flow: redirect the user to a page with a form where they can
    // enter the token if they can't click the link from their email.
  })
  .get("/verif", passport.authenticate("easy", {}), function(req, res, err) {
    const user = req.user;
    if (user) {
      handleResponse(res, 200, user);
    } else if (err) {
      console.log("erreur", err);
      return handleResponse(res, 400, { error: err });
    }
  });

function handleResponse(res, code, statusMsg) {
  res.status(code).json(statusMsg);
}
/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
  console.log(
    "%s App is running at http://localhost:%d in %s mode",
    chalk.green("✓"),
    app.get("port"),
    app.get("env")
  );
});

module.exports = app;
