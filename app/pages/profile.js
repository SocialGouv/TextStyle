import React, { useState } from "react";
import { Image } from "react-bootstrap";
// import Button from "react-bootstrap/Button";
import { withAuthSync, getJwt } from "../utils/auth";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const Profile = () => {
  const userInfo = getJwt();
  const [lastName, setLastName] = useState(userInfo.user.lastName);
  const [firstName, setFirstName] = useState(userInfo.user.firstName);
  const [email, setEmail] = useState(userInfo.user.email);
  const [ministry, setMinistry] = useState(userInfo.user.ministry);
  const [management, setManagement] = useState(userInfo.user.management);

  return (
    <div className="profile">
      <h1>Paramètres du compte</h1>
      <Row>
        <Col xs={12} md={6}>
          <h2>Informations personnelles</h2>
          <div className="mt-5">
            <Image src={"/images/person.png"} alt="person image" />
            <div className="mt-5">
              <form>
                <label htmlFor="lastName">Nom</label>

                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={event => setLastName(event.target.value)}
                />

                <label htmlFor="firstName">Prénom</label>

                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={event => setFirstName(event.target.value)}
                />

                <label htmlFor="email">Adresse mail</label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                />
              </form>
            </div>
          </div>
        </Col>
        <Col xs={12} md={6}>
          <h2>Fiche de poste</h2>
          <form className="mt-5">
            <label htmlFor="ministry">Ministère</label>

            <input
              type="text"
              id="ministry"
              name="ministry"
              value={ministry}
              onChange={event => setMinistry(event.target.value)}
            />
            <label htmlFor="management">Direction</label>

            <input
              type="text"
              id="management"
              name="management"
              value={management}
              onChange={event => setManagement(event.target.value)}
            />
            {/* <Button
              className="add-input"
              variant="secondary"
              size="sm"
              type="submit"
            >
              Ajouter un champs
            </Button> */}
          </form>
        </Col>
      </Row>

      <style jsx>{`
        .profile {
        }
        h1 {
          font-family: HelveticaNeue;
          font-weight: bold;
          color: #777777;
          font-size: 26px;
        }
        h2 {
          font-weight: bold;
          color: #373a3c;
        }
        form {
          display: flex;
          flex-flow: column;
          max-width: 500px;
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
      `}</style>
    </div>
  );
};
export default withAuthSync(Profile);
