import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import Link from "next/link";
import { GET_LIST_PROJECT_QUERY } from "./queries";
import Container from "react-bootstrap/Container";
import { Col, Row, Card, Image } from "react-bootstrap";
import Loading from "../Loading/Loading";
import Button from "react-bootstrap/Button";
import { withRouter } from "next/router";
import PropTypes from "prop-types";
import { getJwt } from "../../utils/auth";

function App(props) {
  const {
    loading: loadingProjects,
    error: errorProjects,
    data: dataProjects
  } = useQuery(GET_LIST_PROJECT_QUERY, { fetchPolicy: "cache-and-network" });
  const userInfo = getJwt();

  const { history } = props;
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
      {history &&
      (history[history.length - 2] === "/login" ||
        history[history.length - 2] === "/signup") ? (
        <Loading />
      ) : (
        ""
      )}
      <div className="home">
        <Row>
          <Col>
            <h1>Profil</h1>
            <div className="mt-5">
              <Row>
                <Col xs={12} md={3}>
                  <Image
                    src={"/images/person.png"}
                    width="150"
                    height="150"
                    alt="person image"
                  />
                </Col>
                <Col xs={12} md={9} className="d-flex flex-column">
                  <h3>
                    {userInfo.user.firstName} {userInfo.user.lastName}
                  </h3>
                  <h5>{userInfo.user.ministry}</h5>
                  <h5>{userInfo.user.management}</h5>
                </Col>
              </Row>
            </div>
          </Col>
          <Col>
            <h1>Notifications</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <header>
              <h1>Projets</h1>
              <nav>
                <Link key={"addProject"} href="/addProject" as={`/addProject`}>
                  <Button
                    variant="secondary"
                    type="submit"
                    className="add-project ml-5"
                  >
                    Ajouter un nouveau projet
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
          </Col>
        </Row>
      </div>

      <style jsx>{`
        h1 {
          font-family: HelveticaNeue;
          font-weight: bold;
          color: #777777;
          font-size: 26px;
        }
        h3 {
          font-size: 22px;
          font-weight: bold;
          color: #777777;
        }
        h5 {
          color: #777777;
        }
      `}</style>
    </Fragment>
  );
}

App.propTypes = {
  history: PropTypes.array
};

export default withRouter(App);
