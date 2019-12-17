import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import Link from "next/link";
import { FaRegClock } from "react-icons/fa";
import { MdCheck } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { GET_PROJECT_QUERY } from "./queries";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

export default function Header(props) {
  const { project, revision, research, status } = props;

  var validatedClass = status === "validated" ? "onThisStatus" : "";
  var waitingClass = status === "waiting" ? "onThisStatus" : "";
  var declinedClass = status === "declined" ? "onThisStatus" : "";

  function withRevision() {
    if (revision) {
      return (
        <Link
          key={"revision-" + project}
          href="/project/[id]/revision"
          as={`/project/${project}/revision`}
        >
          <Button variant="outline-secondary" type="submit">
            Générer les deux colonnes
          </Button>
        </Link>
      );
    }
  }

  function withResearch() {
    if (research) {
      return (
        <Link
          key={"research-" + project}
          href="/project/[id]/research"
          as={`/project/${project}/research`}
        >
          <Button
            className={!revision ? "mb-3" : "mr-3"}
            variant="outline-secondary"
            type="submit"
          >
            Retour à la recherche
          </Button>
        </Link>
      );
    }
  }

  const {
    loading: loadingProjects,
    error: errorProjects,
    data: dataProjects
  } = useQuery(GET_PROJECT_QUERY, {
    variables: { project: project },
    fetchPolicy: "cache-and-network"
  });

  if (loadingProjects) return <p>Loading...</p>;
  if (errorProjects) return <p>Error: {errorProjects.message}</p>;

  return (
    <Fragment>
      <header>
        <Row className="w-100">
          <Col xs={12} md={3} className="mb-2">
            <h2>{dataProjects.project[0].name}</h2>
          </Col>
          <Col xs={12} md={5} className="mb-2">
            {withResearch()}
            {withRevision()}
          </Col>
          <Col xs={12} md={4} className="mb-2">
            <div>
              <Link
                key={"validated"}
                href="/project/[id]/[status]"
                as={`/project/${project}/validated`}
              >
                <button
                  className={`createButton headerButton ${validatedClass}`}
                >
                  <MdCheck key="0" size={20} />
                  Validé
                </button>
              </Link>
              <Link
                key={"waiting"}
                href="/project/[id]/[status]"
                as={`/project/${project}/waiting`}
              >
                <button
                  className={`waitingButton headerButton ${waitingClass}`}
                >
                  <FaRegClock key="0" size={20} />
                  En attente
                </button>
              </Link>

              <Link
                key={"declined"}
                href="/project/[id]/[status]"
                as={`/project/${project}/declined`}
              >
                <button
                  className={`deleteButton headerButton ${declinedClass}`}
                >
                  <IoMdClose key="0" size={20} />
                  Supprimé
                </button>
              </Link>
            </div>
          </Col>
        </Row>
      </header>
    </Fragment>
  );
}

Header.propTypes = {
  project: PropTypes.string,
  revision: PropTypes.bool,
  research: PropTypes.bool,
  status: PropTypes.string
};
