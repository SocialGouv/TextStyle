import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import Link from "next/link";
import { FaRegClock } from "react-icons/fa";
import { MdCheck } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { GET_PROJECT_QUERY } from "./queries";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

export default function Header(props) {
  const { project, status } = props;

  const validatedClass = status === "validated" ? "onThisStatus" : "";
  const waitingClass = status === "waiting" ? "onThisStatus" : "";
  const declinedClass = status === "declined" ? "onThisStatus" : "";

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
        <Row className="w-100 m-0">
          <Col xs={12} md={7} className="mb-2 px-0">
            <h2>
              {dataProjects.project[0] ? dataProjects.project[0].name : ""}
            </h2>
          </Col>
          <Col xs={12} md={5} className="mb-2 px-0">
            <div className="float-right">
              <ButtonGroup>
                <Link
                  key={"validated"}
                  href={"/project/[id]/[status]"}
                  as={`/project/${project}/validated`}
                >
                  <Button
                    className={`createButton headerButton mr-4 ${validatedClass}`}
                  >
                    <MdCheck key="0" size={20} className="mr-3" />
                    Validé
                  </Button>
                </Link>
                <Link
                  key={"waiting"}
                  href={"/project/[id]/[status]"}
                  as={`/project/${project}/waiting`}
                >
                  <Button
                    className={`waitingButton headerButton mr-4 ${waitingClass}`}
                  >
                    <FaRegClock key="0" size={20} className="mr-3" />
                    En attente
                  </Button>
                </Link>
                <Link
                  key={"declined"}
                  href={"/project/[id]/[status]"}
                  as={`/project/${project}/declined`}
                >
                  <Button
                    className={`deleteButton headerButton ${declinedClass}`}
                  >
                    <IoMdClose key="0" size={20} className="mr-3" />
                    Supprimé
                  </Button>
                </Link>
              </ButtonGroup>
            </div>
          </Col>
        </Row>
      </header>
    </Fragment>
  );
}

Header.propTypes = {
  project: PropTypes.string,
  status: PropTypes.string
};
