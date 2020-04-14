import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import Link from "next/link";
import { GET_LIST_PROJECT_QUERY } from "./queries";
import Container from "react-bootstrap/Container";
import { Col, Row, Card } from "react-bootstrap";
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
      href={"/project/[id]/research"}
      as={`/project/${project.id}/research`}
    >
      <Col md={6}>
        <Card className="card-list">
          <Card.Header>{project.name}</Card.Header>
          <Card.Body>
            <Col xs={12} sm={12} md={9}>
              <Row>
                <Card.Text>{project.description}</Card.Text>
              </Row>
            </Col>
            <Col xs={12} sm={12} md={3}>
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
      </Col>
    </Link>
  ));
  return (
    <Fragment>
      {history &&
      (history[history.length - 2] === "/login" ||
        history[history.length - 2] === "/verif") ? (
        <Loading />
      ) : (
        ""
      )}
      <div className="home">
        <Row className="pl-5">
          <h1>Dashboard</h1>
        </Row>
        <Row>
          <Card className="card-container">
            <Card.Body>
              <Card.Title>
                <h1>Profil</h1>
              </Card.Title>

              <Row>
                <Col>
                  <div className="profil-image">
                    <Card.Img
                      variant="top"
                      src={"/icon/Profil-femme-1.svg"}
                      alt="person image"
                    />
                  </div>
                </Col>
                <Col className="d-flex flex-column justify-content-around my-3">
                  <h3>
                    {userInfo.user.firstName} {userInfo.user.lastName}
                  </h3>
                  <h3>{userInfo.user.ministry}</h3>
                  <h3>{userInfo.user.management}</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="card-container notif">
            <Card.Body className="p-0">
              <Card.Text>
                <Row>
                  <Col className="d-flex flex-column justify-content-center my-3 ml-5">
                    <h4>Bonjour {userInfo.user.firstName},</h4>
                    <h4 className="mt-2">
                      Tu as consulté 40% de tes notifications.
                    </h4>
                  </Col>
                  <Col>
                    <Card.Img variant="top" src={"/images/notif.png"} />
                  </Col>
                </Row>
              </Card.Text>
            </Card.Body>
          </Card>
        </Row>
        <Row>
          <Col className="p-0">
            <Card className="card-container mt-5">
              <Card.Body>
                <header>
                  <h1>Projects</h1>
                  <nav>
                    <Link
                      key={"addProject"}
                      href={"/addProject"}
                      as={`/addProject`}
                    >
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
                <Container fluid className="p-0 m-0 row">
                  {projects.length > 0 ? (
                    projects
                  ) : (
                    <p className="fz-14px">
                      Vous n&apos;avez pas encore de projet
                    </p>
                  )}
                </Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <style jsx>{`
        h1 {
          font-family: HelveticaNeue;
          font-weight: bold;
          color: #08131f;
          font-size: 22px;
        }
        h3 {
          font-size: 16px;
          font-weight: bold;
          color: #000;
        }
        h4 {
          font-size: 16px;
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
