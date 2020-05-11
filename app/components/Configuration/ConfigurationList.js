import React, { useState } from "react";
import PropTypes from "prop-types";
import { Col, Row, Button, FormControl } from "react-bootstrap";

import { useMutation, useQuery } from "@apollo/react-hooks";
import Container from "react-bootstrap/Container";
import { GET_PROJECT_QUERY, EDIT_PROJECT } from "./queries";
import Alert from "react-bootstrap/Alert";

export default function ConfigurationList(props) {
  let inputName = "";
  let inputDescription = "";
  const { project } = props;
  const [editProject] = useMutation(EDIT_PROJECT);
  const [show, setShow] = useState(false);
  const msgSuccess = "La modification est effectuée avec succès";
  const alert = (
    <Alert
      className="mb-3"
      variant="success"
      onClose={() => setShow(false)}
      dismissible
    >
      <Alert.Heading>{msgSuccess}</Alert.Heading>
    </Alert>
  );
  const { data: dataProjects } = useQuery(GET_PROJECT_QUERY, {
    variables: {
      project: project
    },
    fetchPolicy: "cache-and-network"
  });
  return (
    <Container fluid>
      <h1>Gestion du projet</h1>
      <h2>Nom et Description</h2>
      <Row> {show && alert}</Row>
      <form
        className="mt-3"
        onSubmit={e => {
          e.preventDefault();
          editProject({
            variables: {
              project: project,
              name: inputName.value,
              description: inputDescription.value
            },
            refetchQueries: ["GET_PROJECT_QUERY"]
          }).then(() => setShow(true));
        }}
      >
        <Row>
          <Col>
            <h4 className="mt-3">Nom du projet</h4>
            <FormControl
              name="Nom du projet"
              className="col-6"
              defaultValue={
                dataProjects === undefined ? "" : dataProjects.project[0].name
              }
              ref={node => {
                inputName = node;
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <h4 className="mt-3">Description du projet</h4>
            <FormControl
              as="textarea"
              rows="3"
              name="Description du projet"
              className="col-6"
              defaultValue={
                dataProjects === undefined
                  ? ""
                  : dataProjects.project[0].description
              }
              ref={node => {
                inputDescription = node;
              }}
            />
          </Col>
        </Row>
        <Row className="mx-0 mt-3">
          <Button variant="secondary" type="submit">
            Modifier
          </Button>
        </Row>
      </form>

      <style jsx>{`
        h2 {
          font-size: 26px;
          font-weight: lighter;
          margin-bottom: 0;
          text-align: left;
          margin: 1em 0;
        }
        h4 {
          font-family: HelveticaNeue;
          font-size: 16px;
          color: #373a3c;
        }
      `}</style>
    </Container>
  );
}
ConfigurationList.propTypes = {
  project: PropTypes.string
};
