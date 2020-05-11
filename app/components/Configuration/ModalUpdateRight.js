import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Row, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import { useMutation } from "@apollo/react-hooks";
import {
  ADD_PROJECT_ADMINISTRATOR,
  ADD_PROJECT_WRITER,
  DELETE_PROJECT_ADMINISTRATOR,
  DELETE_PROJECT_WRITER
} from "./queries";
export default function ModalUpdateRight(props) {
  const { project, role, show } = props;
  const [updatedRole, setUpdatedRole] = useState("");
  const roleChanged = role !== updatedRole;

  useEffect(() => {
    if (updatedRole === "") {
      setUpdatedRole(role);
    }
    if (!show) {
      setUpdatedRole("");
    }
  }, [role, updatedRole, props, show]);
  const [addWriter] = useMutation(ADD_PROJECT_WRITER);
  const [deleteAdministrator] = useMutation(DELETE_PROJECT_ADMINISTRATOR);
  const [addAdministrator] = useMutation(ADD_PROJECT_ADMINISTRATOR);
  const [deleteWriter] = useMutation(DELETE_PROJECT_WRITER);
  const updateRight = id => {
    if (updatedRole === "Admin") {
      addAdministrator({
        variables: {
          administrator: id,
          project: project,
          unique_administrator: id + "_" + project
        },
        refetchQueries: ["GET_LIST_USER_PROJECT_QUERY"]
      });
      deleteWriter({
        variables: {
          writer: id,
          project: project
        },
        refetchQueries: ["GET_LIST_USER_PROJECT_QUERY"]
      });
    } else {
      addWriter({
        variables: {
          writer: id,
          project: project,
          unique_writer: id + "_" + project
        },
        refetchQueries: ["GET_LIST_USER_PROJECT_QUERY"]
      });
      deleteAdministrator({
        variables: {
          administrator: id,
          project: project
        },
        refetchQueries: ["GET_LIST_USER_PROJECT_QUERY"]
      });
    }
    setUpdatedRole("");
    props.onHide();
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="titreHeader">
          <span>
            Gestion des droits - {props.user.firstName} {props.user.lastName}
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col>
              <Button
                variant="link"
                onClick={() => {
                  setUpdatedRole("Utilisateur");
                }}
              >
                <Col
                  className={
                    updatedRole === "Utilisateur"
                      ? "contentModalRight activeSelect"
                      : "contentModalRight"
                  }
                >
                  <div className="RectangleModalRight" />
                  <Row className="justify-content-center">
                    <span className="selectBlocTitle">Rédacteur</span>
                  </Row>
                  <Row>
                    <span className="descBloc">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      consectetur adipiscing elit.
                    </span>
                  </Row>
                </Col>
              </Button>
            </Col>
            <Col>
              <Button
                variant="link"
                onClick={() => {
                  setUpdatedRole("Admin");
                }}
              >
                <Col
                  className={
                    updatedRole === "Admin"
                      ? "contentModalRight activeSelect"
                      : "contentModalRight"
                  }
                >
                  <div className="RectangleModalRight" />
                  <Row className="justify-content-center">
                    <span className="selectBlocTitle">Admin</span>
                  </Row>
                  <Row>
                    <span className="descBloc">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      consectetur adipiscing elit.
                    </span>
                  </Row>
                </Col>
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer className="py-5">
        <Button
          disabled={!roleChanged}
          className={roleChanged ? "" : "disabled"}
          onClick={function() {
            updateRight(props.user.id);
          }}
          variant="secondary"
        >
          Changer le droit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
ModalUpdateRight.propTypes = {
  role: PropTypes.string,
  project: PropTypes.string,
  onHide: PropTypes.func,
  user: PropTypes.object,
  show: PropTypes.bool
};
