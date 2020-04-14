import React, { useState } from "react";
import { Image } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { withAuthSync } from "../../utils/auth";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import PropTypes from "prop-types";
import { EDIT_USER } from "./queries";
import { useMutation } from "@apollo/react-hooks";
import Spinner from "react-bootstrap/Spinner";
const Profile = props => {
  const { userInfo } = props;
  const [editUser, { loading: editLoading, error: editError }] = useMutation(
    EDIT_USER
  );

  const [userInfos] = useState(userInfo.user);
  const [ministry, setMinistry] = useState(userInfos.ministry);

  const [management, setManagement] = useState(userInfos.management);
  const handleSubmit = event => {
    event.preventDefault();
    editUser({
      variables: {
        email: userInfos.email,
        ministry: ministry,
        management: management
      },
      refetchQueries: ["GET_USER_QUERY"]
    });
  };
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
                  readOnly
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={userInfo.user.lastName}
                />

                <label htmlFor="firstName">Prénom</label>

                <input
                  readOnly
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={userInfo.user.firstName}
                />

                <label htmlFor="email">Adresse mail</label>

                <input
                  readOnly
                  type="email"
                  id="email"
                  name="email"
                  value={userInfo.user.email}
                />
              </form>
            </div>
          </div>
        </Col>
        <Col xs={12} md={6}>
          <h2>Fiche de poste</h2>
          <form className="mt-5" onSubmit={handleSubmit}>
            <label htmlFor="ministry">Ministère</label>

            <input
              required
              type="text"
              id="ministry"
              name="ministry"
              value={ministry}
              onChange={event => setMinistry(event.target.value)}
            />
            <label htmlFor="management">Direction</label>
            <input
              required
              type="text"
              id="management"
              name="management"
              value={management}
              onChange={event => setManagement(event.target.value)}
            />
            {!editLoading && (
              <Button className="add-input" variant="secondary" type="submit">
                Valider les modifications
              </Button>
            )}
            {editLoading && (
              <Button className="add-input" variant="secondary" disabled>
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
          </form>

          {editError && editError.message}
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
Profile.propTypes = {
  userInfo: PropTypes.object
};
export default withAuthSync(Profile);
