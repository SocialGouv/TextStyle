import React from "react";
import Link from "next/link";
import Router from "next/router";
import NProgress from "nprogress";
import { FaBook } from "react-icons/fa";

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

export default function Header() {
  return (
    <div className="header">
      <h1>
        <Link href="/">
          <a>
            <FaBook />
            TextStyle
          </a>
        </Link>
      </h1>
    </div>
  );
}
