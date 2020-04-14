import React from "react";
import Link from "next/link";
import Router from "next/router";
import NProgress from "nprogress";
import { logout, getJwt } from "../utils/auth";
import Button from "react-bootstrap/Button";
import { Row } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import PropTypes from "prop-types";
import Image from "react-bootstrap/Image";

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

export default function Header(props) {
  const { router } = Router;
  const { id } = props;
  const isConnected = getJwt();

  let currentRoute;
  const searchRoutes = () => {
    return (
      currentRoute === "/project/[id]/research" ||
      currentRoute === "/project/[id]/validated" ||
      currentRoute === "/project/[id]/waiting" ||
      currentRoute === "/project/[id]/[status]" ||
      currentRoute === "/project/[id]/declined"
    );
  };

  if (router === null) {
    return <div className="header p-0" />;
  } else {
    currentRoute = router.route;
  }

  return (
    <div className="header p-0">
      <Row xs={10} md={10} className="header-menu">
        <Col>
          <div className=" menu-container text-center mt-5 d-flex flex-column">
            <Link href="/">
              <span className="logo-container mb-5">
                <Image src={"/icon/Logo.svg"} width="40" height="40" />
              </span>
            </Link>
            <Link key={`home`} href="/" as={`/`}>
              <Button
                className={
                  currentRoute === "/"
                    ? `menu-img activeRoute text-left`
                    : `menu-img mt-5 text-left`
                }
              >
                {currentRoute === "/" && (
                  <Image src={"/icon/Dashboard.svg"} width="20" height="20" />
                )}
                {currentRoute !== "/" && (
                  <Image
                    src={"/icon/white/Dashboard.svg"}
                    width="20"
                    height="20"
                  />
                )}
              </Button>
            </Link>
            <Link key={`profile`} href={"/profile"} as={`/profile`}>
              <Button
                className={
                  currentRoute === "/profile"
                    ? `menu-img activeRoute text-left`
                    : `menu-img text-left`
                }
              >
                {currentRoute === "/profile" && (
                  <Image src={"/icon/Profil.svg"} width="20" height="20" />
                )}
                {currentRoute !== "/profile" && (
                  <Image
                    src={"/icon/white/profil.svg"}
                    width="20"
                    height="20"
                  />
                )}
              </Button>
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
                <Button
                  className={
                    searchRoutes()
                      ? `menu-img d-inline-block align-top mt-5 activeRoute`
                      : `menu-img d-inline-block align-top mt-5`
                  }
                >
                  {searchRoutes() && (
                    <Image src={"/icon/Search.svg"} width="20" height="20" />
                  )}
                  {!searchRoutes() && (
                    <Image
                      src={"/icon/white/Search.svg"}
                      width="20"
                      height="20"
                    />
                  )}
                </Button>
              </Link>
              <Link
                key={`revision-${id}`}
                href={"/project/[id]/revision"}
                as={`/project/${id}/revision`}
              >
                <Button
                  className={
                    currentRoute === "/project/[id]/revision" && !searchRoutes()
                      ? `menu-img activeRoute text-left`
                      : `menu-img text-left`
                  }
                >
                  {currentRoute === "/project/[id]/revision" &&
                    !searchRoutes() && (
                      <Image
                        src={"/icon/revision.svg"}
                        width="20"
                        height="20"
                      />
                    )}
                  {currentRoute !== "/project/[id]/revision" && (
                    <Image
                      src={"/icon/white/revision.svg"}
                      width="20"
                      height="20"
                    />
                  )}
                </Button>
              </Link>
              <Link
                key={`configuration-${id}`}
                href={"/project/[id]/configuration"}
                as={`/project/${id}/configuration`}
              >
                <Button
                  className={
                    currentRoute === "/project/[id]/configuration" &&
                    !searchRoutes()
                      ? `menu-img activeRoute text-left`
                      : `menu-img mt-5 text-left`
                  }
                >
                  {currentRoute === "/project/[id]/configuration" &&
                    !searchRoutes() && (
                      <Image src={"/icon/config.svg"} width="20" height="20" />
                    )}
                  {currentRoute !== "/project/[id]/configuration" && (
                    <Image
                      src={"/icon/white/config.svg"}
                      width="20"
                      height="20"
                    />
                  )}
                </Button>
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
