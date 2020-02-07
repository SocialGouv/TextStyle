import React, { useState } from "react";
import PropTypes from "prop-types";
import { Col, Row, Button } from "react-bootstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

import ModalUpdateDroit from "./ModalUpdateDroit";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  ADD_PROJECT_WRITER,
  DELETE_PROJECT_ADMINISTRATOR,
  DELETE_PROJECT_WRITER
} from "./queries";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ModalAddMembers from "../Modals/ModalAddMembers";
import { GET_LIST_NOT_USERS_QUERY } from "../Projects/queries";
import Container from "react-bootstrap/Container";

export default function MembresList(props) {
  const [modalShowEdit, setModalShowEdit] = useState(false);
  const [modalShowAdd, setModalShowAdd] = useState(false);
  const [currentRole, setCurrentRole] = useState("");
  const { user, administrator, writer, project } = props;
  const [currentUser, setCurrentUser] = useState(administrator[0]);

  const membersAll = user.map(obj => ({
    ...obj,
    isAdmin: !!administrator.find(
      ({ administrator_id }) => obj.id === administrator_id
    ),
    isUser: !!writer.find(({ writer_id }) => obj.id === writer_id)
  }));
  const privilegedMembers = membersAll.filter(
    member => member.isAdmin || member.isUser
  );
  const isAdmin = role => {
    return role === "admin";
  };
  const getRole = user => {
    if (user.isAdmin) {
      return "Admin";
    } else return "Rédacteur";
  };
  const openModal = member => {
    setCurrentRole("");
    setCurrentUser(member);
    if (member.isAdmin) {
      setCurrentRole("Admin");
    } else {
      setCurrentRole("Utilisateur");
    }
    setModalShowEdit(true);
  };
  const handleClose = () => {
    setCurrentRole(" ");
    setModalShowEdit(false);
  };

  const [deleteAdministrator] = useMutation(DELETE_PROJECT_ADMINISTRATOR);
  const [deleteWriter] = useMutation(DELETE_PROJECT_WRITER);
  const [addWriter] = useMutation(ADD_PROJECT_WRITER);

  const ids = privilegedMembers.map(({ id }) => id);
  const { loading: loadingUsers, error: errorUsers, data: users } = useQuery(
    GET_LIST_NOT_USERS_QUERY,
    {
      variables: { users: ids },
      fetchPolicy: "cache-and-network"
    }
  );
  if (loadingUsers) return <p>Loading...</p>;
  if (errorUsers) return <p>Error: {errorUsers.message}</p>;
  const register = members => {
    members.forEach(element =>
      addWriter({
        variables: {
          writer: element.id,
          project: project,
          unique_writer: element.id + "_" + project
        },
        refetchQueries: ["GET_LIST_USER_PROJECT_QUERY"]
      })
    );
  };
  const toolbar = (
    <ButtonToolbar className="ml-3 mt-3">
      <Button
        variant="secondary"
        className="buttonRight mt-5"
        onClick={() => setModalShowAdd(true)}
      >
        Ajouter un membre au projet
      </Button>

      <ModalAddMembers
        show={modalShowAdd}
        onHide={() => setModalShowAdd(false)}
        onRegister={register}
        defaults={[]}
        users={users.user}
        name="rédacteur"
      />
    </ButtonToolbar>
  );
  function deleteProject(id, role) {
    if (isAdmin(role)) {
      deleteAdministrator({
        variables: {
          administrator: id,
          project: project
        },
        refetchQueries: ["GET_LIST_USER_PROJECT_QUERY"]
      });
    } else {
      deleteWriter({
        variables: {
          writer: id,
          project: project
        },
        refetchQueries: ["GET_LIST_USER_PROJECT_QUERY"]
      });
    }
  }

  return (
    <Container fluid className="mx-0">
      <Col>
        <Row className="mt-5">
          <h2>Membres</h2>
        </Row>
        <Row className="mt-2">
          <h4>Tableau membres</h4>
        </Row>
        <Row className="mt-2">
          <Table>
            <Thead>
              <Tr>
                <Th>Prénom</Th>
                <Th>Nom</Th>
                <Th>Droit</Th>
                <Th />
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {privilegedMembers.map(membre => (
                <Tr key={membre.id}>
                  <Td>{membre.firstName}</Td>
                  <Td>{membre.lastName}</Td>
                  <Td>{getRole(membre)}</Td>
                  <Td>
                    <Button
                      variant="link"
                      onClick={() => {
                        openModal(membre);
                      }}
                    >
                      Modifier droits
                    </Button>
                  </Td>
                  <Td>
                    <Button
                      variant="link"
                      onClick={() => deleteProject(membre.id, getRole(membre))}
                      className="hoverLinkRed"
                    >
                      Supprimer du projet
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Row>
        <ModalUpdateDroit
          show={modalShowEdit}
          onHide={handleClose}
          user={currentUser}
          project={project}
          role={currentRole}
        />
        {toolbar}
      </Col>
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
MembresList.propTypes = {
  user: PropTypes.array,
  administrator: PropTypes.array,
  writer: PropTypes.array,
  project: PropTypes.string
};
