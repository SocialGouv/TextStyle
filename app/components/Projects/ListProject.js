import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import Link from "next/link";
import { GET_LIST_PROJECT_QUERY } from "./queries";
import Container from "react-bootstrap/Container";
import { Col, Row, Card } from "react-bootstrap";
import Loading from "../Loading/Loading";
import Button from "react-bootstrap/Button";

export default function App() {
  const {
    loading: loadingProjects,
    error: errorProjects,
    data: dataProjects
  } = useQuery(GET_LIST_PROJECT_QUERY, { fetchPolicy: "cache-and-network" });

  if (loadingProjects) return <p>Loading...</p>;
  if (errorProjects) return <p>Error: {errorProjects.message}</p>;

  const projects = dataProjects.project.map(project => (
    <Link
      key={project.id}
      href="/project/[id]/research"
      as={`/project/${project.id}/research`}
    >
      <Card className="card-list">
        <Card.Header>{project.name}</Card.Header>
        <Card.Body>
          <Col xs={12} md={10}>
            <Row>
              <Card.Text>{project.description}</Card.Text>
            </Row>
          </Col>
          <Col xs={12} md={2}>
            <p className="text-right">
              Crée le{" "}
              {project.create_at.split("-")[2] +
                "/" +
                project.create_at.split("-")[1] +
                "/" +
                project.create_at.split("-")[0]}
            </p>
          </Col>
        </Card.Body>
      </Card>
    </Link>
  ));

  return (
    <Fragment>
      <Loading />
      <header>
        <h2>Liste des projets</h2>
        <nav>
          <Link key={"addProject"} href="/addProject" as={`/addProject`}>
            <Button variant="outline-secondary" type="submit">
              Ajouter un projet
            </Button>
          </Link>
        </nav>
      </header>
      <Container fluid className="p-0">
        {projects.length > 0 ? (
          projects
        ) : (
          <p className="fz-14px">Vous n&apos;avez pas encore de projet</p>
        )}
      </Container>
    </Fragment>
  );
}
