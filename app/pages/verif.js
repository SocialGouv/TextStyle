import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import fetch from "isomorphic-unfetch";
import Router from "next/router";
import cookie from "js-cookie";

const Verif = props => {
  const { email, token } = props;
  const [confirming, setConfirming] = useState(true);
  const [msg, setMsg] = useState(true);

  useEffect(() => {
    fetch(`api/verif?email=${email}&token=${token}`)
      .then(data => {
        if (data.status === 200) {
          data.json().then(function(res) {
            setConfirming(false);
            const token = res.token;
            setMsg(data.msg);
            cookie.set("token", token, { expires: 30 }); // token receive from api valid for 30 days
            Router.push("/");
          });
        } else {
          Router.push("/login");
        }
      })
      .catch(err => {
        console.log(err);
        Router.push("/login");
      });
  });

  return <div> {confirming ? <div /> : <div>{msg} </div>}</div>;
};

Verif.getInitialProps = async function(req) {
  return {
    email: req.query.email,
    token: req.query.token,
    apiUrl: "/api/verif"
  };
};

Verif.propTypes = {
  token: PropTypes.string,
  email: PropTypes.string
};
export default Verif;
