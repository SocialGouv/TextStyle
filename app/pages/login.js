import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import { login } from "../utils/auth";
import { Card } from "react-bootstrap";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";

const Login = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();
    const url = props.apiUrl;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        const { token } = await response.json();
        login({ token });
      } else {
        // https://github.com/developit/unfetch#caveats
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    } catch (error) {
      console.error(
        "You have an error in your code or there are Network issues.",
        error
      );
      setError(error.message);
    }
  };

  return (
    <div className="login">
      <h2> Bienvenue dans TextStyle</h2>
      <Card className="card-login">
        <Card.Header>Login</Card.Header>
        <Card.Body>
          <div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Adresse mail</label>

              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
              />
              <label htmlFor="username">Mot de passe</label>

              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
              />
              <Link
                key={"addProject"}
                href="/passwordForget"
                as={`/passwordForget`}
              >
                Mot de passe oublié
              </Link>

              <Button
                className="mt-5 btn-login"
                variant="secondary"
                type="submit"
              >
                Connexion
              </Button>

              <p className={`error ${error && "show"}`}>
                {error && `Error: ${error}`}
              </p>
            </form>
          </div>
        </Card.Body>
      </Card>

      <style jsx>{`
        form {
          display: flex;
          flex-flow: column;
        }

        label {
          color: #373a3c;
          font-size: 16px;
        }

        input {
          padding: 8px;
          margin: 0.3rem 0 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }

        .error {
          margin: 0.5rem 0 0;
          display: none;
          color: brown;
        }

        .error.show {
          display: block;
        }
      `}</style>
    </div>
  );
};

Login.getInitialProps = async function() {
  const apiUrl = "/api/login";

  return { apiUrl };
};
Login.propTypes = {
  apiUrl: PropTypes.string
};
export default Login;
