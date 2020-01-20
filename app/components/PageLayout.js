import React from "react";
import Head from "next/head";
import GlobalStyles from "./styles/GlobalStyles";
import Header from "./Header";
import PropTypes from "prop-types";
import { Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";

export default function PageLayout(props) {
  const url = props.children.props.apiUrl;
  const hasHeader = url === "/api/login" || url === "/api/signup";
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
          src="/ckeditor/plugins/lite/lite-interface.js"
        />
      </Head>
      <Row>
        <Col xs={3} md={2}>
          {!hasHeader && (
            <Header
              id={props.children.props.id ? props.children.props.id : null}
            />
          )}
        </Col>
        <Col xs={!hasHeader ? 8 : 12} md={!hasHeader ? 9 : 12}>
          <div className={!hasHeader ? "main" : " hasHeader main"}>
            {props.children}
          </div>
        </Col>
      </Row>
    </div>
  );
}
PageLayout.propTypes = {
  children: PropTypes.object
};
