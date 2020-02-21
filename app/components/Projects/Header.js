import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import Link from "next/link";
import { FaRegClock } from "react-icons/fa";
import { MdCheck } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { GET_PROJECT_QUERY } from "./queries";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

export default function Header(props) {
  const { project, status } = props;

  var validatedClass = status === "validated" ? "onThisStatus" : "";
  var waitingClass = status === "waiting" ? "onThisStatus" : "";
  var declinedClass = status === "declined" ? "onThisStatus" : "";

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
              <Link
                key={"validated"}
                href={"/project/[id]/[status]"}
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
                href={"/project/[id]/[status]"}
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
                href={"/project/[id]/[status]"}
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
  status: PropTypes.string
};
