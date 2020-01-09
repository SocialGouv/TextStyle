import React, { Fragment, useEffect } from "react";
import { getJwt } from "../../utils/auth";

export default function Loading() {
  useEffect(() => {
    var header = document.querySelector(".main header");
    header.classList.add("visuallyMainHidden");
    var main = document.querySelector(".main .p-0");
    main.classList.add("visuallyMainHidden");
    setTimeout(function() {
      var loading = document.querySelector(".loading-title");
      loading.classList.add("visuallyHidden");
      main.classList.add("visuallyMain");
      header.classList.add("visuallyMain");
    }, 3000);
  });
  const userInfo = getJwt();

  return (
    <Fragment>
      <h2 className="loading-title">
        {" "}
        Bienvenue dans TextStyle <br></br>
        <strong className="loading-strong">{userInfo.name}</strong>
      </h2>
    </Fragment>
  );
}
