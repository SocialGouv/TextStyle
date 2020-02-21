import React, { Fragment, useEffect } from "react";
import { getJwt } from "../../utils/auth";

export default function Loading() {
  useEffect(() => {
    var homePage = document.querySelector(".home");
    var main = document.querySelector(".main .p-0");
    main.classList.add("visuallyMainHidden");
    homePage.classList.add("visuallyMainHidden");
    setTimeout(function() {
      var loading = document.querySelector(".loading-title");
      loading.classList.add("visuallyHidden");
      main.classList.add("visuallyMain");
      homePage.classList.add("visuallyMain");
    }, 3000);
  });
  const userInfo = getJwt();

  return (
    <Fragment>
      <h2 className="loading-title">
        Bienvenue dans TextStyle <br />
        <strong className="loading-strong">{userInfo.user.firstName}</strong>
      </h2>
    </Fragment>
  );
}
