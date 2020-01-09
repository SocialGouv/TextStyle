import React from "react";
import Link from "next/link";
import Router from "next/router";
import NProgress from "nprogress";
import { FaBook } from "react-icons/fa";
import { logout, getJwt } from "../utils/auth";
import Button from "react-bootstrap/Button";

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

export default function Header() {
  const isConnected = getJwt();
  return (
    <div className="header">
      <h1 className="d-inline-block">
        <Link href="/">
          <a>
            <FaBook />
            TextStyle
          </a>
        </Link>
      </h1>
      {isConnected ? (
        <Button
          variant="outline-secondary"
          onClick={logout}
          className="float-right btn btn-outline buttonHome"
        >
          Déconnexion
        </Button>
      ) : (
        ""
      )}
    </div>
  );
}
