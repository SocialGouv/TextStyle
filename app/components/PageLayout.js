import React from "react";
import Head from "next/head";
import GlobalStyles from "./styles/GlobalStyles";
import Header from "./Header";
import PropTypes from "prop-types";
import { Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";

export default function PageLayout(props) {
  const url = props.children.props.apiUrl;
  const hasHeader = url === "/api/verif";
  return (
    <div>
      <GlobalStyles />
      <Head>
        <title>TextStyle</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="stylesheet" type="text/css" href={"/css/nprog.css"} />
        <link
          rel="stylesheet"
          type="text/css"
          href={"/css/SuperResponsiveTableStyle.css"}
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/react-bootstrap-typeahead/css/Typeahead.css"
        />

        <script
          src={
            "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"
          }
        />
        <script
          type="text/javascript"
          src={"/ckeditor/plugins/lite/lite-interface.js"}
        />
      </Head>
      <Row style={{ width: "100%", position: "absolute", height: "100%" }}>
        {!hasHeader && (
          <Col xs={3} md={2} lg={1} className="p-0">
            <Header
              id={props.children.props.id ? props.children.props.id : null}
            />
          </Col>
        )}

        <Col
          xs={!hasHeader ? 9 : 12}
          md={!hasHeader ? 10 : 12}
          lg={!hasHeader ? 11 : 12}
        >
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
