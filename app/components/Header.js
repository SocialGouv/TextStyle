import React from "react";
import Link from "next/link";
import Router from "next/router";
import NProgress from "nprogress";
import { FaBook } from "react-icons/fa";
import { logout, getJwt } from "../utils/auth";
import Button from "react-bootstrap/Button";
import { Row } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import PropTypes from "prop-types";

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

export default function Header(props) {
  const { router } = Router;
  const { id } = props;
  const isConnected = getJwt();

  let currentRoute = "/";

  if (router) {
    currentRoute = router.route;
  }

  return (
    <div className="header p-0 justify-content-center">
      <h1 className="d-inline-block">
        <Link href="/">
          <a>
            <FaBook />
            TextStyle
          </a>
        </Link>
      </h1>
      <Row xs={10} md={10} className="header-menu">
        <Col>
          <div className="text-center mt-5 d-flex flex-column justify-content-center">
            <Link key={`home`} href="/" as={`/`}>
              <img
                src={"/icon/Dashboard.svg"}
                width="20"
                height="20"
                className={
                  currentRoute === "/"
                    ? `menu-img d-inline-block align-top mt-5 activeRoute`
                    : `menu-img d-inline-block align-top mt-5`
                }
                alt="React Bootstrap logo"
              />
            </Link>
            <Link key={`profile`} href={"/profile"} as={`/profile`}>
              <img
                src={"/icon/User.svg"}
                width="20"
                height="20"
                className={
                  currentRoute === "/profile"
                    ? `menu-img d-inline-block align-top mt-5 activeRoute`
                    : `menu-img d-inline-block align-top mt-5`
                }
                alt="React Bootstrap logo"
              />
            </Link>
          </div>
          {id ? (
            <div className="text-center mt-5 d-flex flex-column ">
              <hr />
              <Link
                key={`research-${id}`}
                href={"/project/[id]/research"}
                as={`/project/${id}/research`}
              >
                <img
                  src={"/icon/Search.svg"}
                  width="20"
                  height="20"
                  className={
                    currentRoute === "/project/[id]/research"
                      ? `menu-img d-inline-block align-top mt-5 activeRoute`
                      : `menu-img d-inline-block align-top mt-5`
                  }
                  alt="React Bootstrap logo"
                />
              </Link>
              <Link
                key={`revision-${id}`}
                href={"/project/[id]/revision"}
                as={`/project/${id}/revision`}
              >
                <img
                  src={"/icon/File.svg"}
                  width="20"
                  height="20"
                  className={
                    currentRoute === "/project/[id]/revision"
                      ? `menu-img d-inline-block align-top mt-5 activeRoute`
                      : `menu-img d-inline-block align-top mt-5`
                  }
                  alt="React Bootstrap logo"
                />
              </Link>
              <Link
                key={`configuration-${id}`}
                href={"/project/[id]/configuration"}
                as={`/project/${id}/configuration`}
              >
                <img
                  src={"/icon/Setting.svg"}
                  width="20"
                  height="20"
                  className={
                    currentRoute === "/project/[id]/configuration"
                      ? `menu-img d-inline-block align-top mt-5 activeRoute`
                      : `menu-img d-inline-block align-top mt-5`
                  }
                  alt="React Bootstrap logo"
                />
              </Link>
            </div>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Row xs={2} md={2}>
        <Col>
          {isConnected ? (
            <Button
              variant="light"
              onClick={logout}
              className="float-right btn btn-outline buttonHome"
            >
              <img
                src={"/icon/Log-Out.svg"}
                width="20"
                height="20"
                className="menu-img d-inline-block align-top"
                alt="React Bootstrap logo"
              />
            </Button>
          ) : (
            ""
          )}
        </Col>
      </Row>
    </div>
  );
}

Header.propTypes = {
  id: PropTypes.string
};
