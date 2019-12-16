import React from "react";
import Head from "next/head";
import GlobalStyles from "./styles/GlobalStyles";
import Header from "./Header";
import PropTypes from "prop-types";

export default function PageLayout(props) {
  return (
    <div>
      <GlobalStyles />
      <Head>
        <title>TextStyle</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="stylesheet" type="text/css" href="/css/nprog.css" />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" />
        <script
          type="text/javascript"
          src="ckeditor/plugins/lite/lite-interface.js"
        />
      </Head>

      <Header />

      <div className="main">{props.children}</div>
    </div>
  );
}
PageLayout.propTypes = {
  children: PropTypes.object
};
