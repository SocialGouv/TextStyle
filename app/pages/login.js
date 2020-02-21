import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import { login } from "../utils/auth";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

const Login = props => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(true);
  const [loading, setLoading] = useState(false);

  const { history } = props;
  const existVerif = !!(
    history.length === 2 && history[0].startsWith("/verif")
  );
  const msgError = "Le lien de connexion a expiré ou n'est pas valide.";
  const msgSuccess =
    "Un mail vient d'être envoyer pour vous connecter sur la plateforme";
  const alert = (
    <Alert
      className="mb-3"
      variant="danger"
      onClose={() => setShowError(false)}
      dismissible
    >
      <Alert.Heading>{msgError}</Alert.Heading>
    </Alert>
  );
  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    const url = props.apiUrl;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (response) {
        setLoading(false);
        setShowError(false);
        setShowSuccess(true);
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
      {existVerif && showError && alert}
      <Card className="card-login">
        <Card.Header>Login</Card.Header>
        <Card.Body>
          <div>
            {!showSuccess && (
              <form onSubmit={handleSubmit}>
                <label htmlFor="email">Adresse mail</label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  required
                  onChange={event => setEmail(event.target.value)}
                />
                {!loading && (
                  <Button
                    className="mt-5 btn-login"
                    variant="secondary"
                    type="submit"
                  >
                    Connexion
                  </Button>
                )}
                {loading && (
                  <Button
                    className="mt-5 btn-login"
                    variant="secondary"
                    disabled
                  >
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Loading...</span>
                  </Button>
                )}

                <p className={`error ${error && "show"}`}>
                  {error && `Error: ${error}`}
                </p>
              </form>
            )}
            {showSuccess && (
              <div className="text-center">
                <h3 className="my-5">{msgSuccess}</h3>
              </div>
            )}
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
        h3 {
          color: #5d5a5a;
          font-size: 15px;
        }

        input {
          padding: 8px;
          margin: 0.3rem 0 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          width: 100%;
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
  const apiUrl = "/api/verif";
  return { apiUrl };
};
Login.propTypes = {
  apiUrl: PropTypes.string,
  history: PropTypes.array
};
export default Login;
