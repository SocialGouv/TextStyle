import React, { Fragment, useState } from "react";
import Router from "next/router";
import PropTypes from "prop-types";

import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  ADD_PROJECT,
  GET_LIST_PROJECT_QUERY,
  GET_LIST_USER_QUERY
} from "./queries";

import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import { Row } from "react-bootstrap";

import AdminAdd from "./AdminAdd";
import MemberAdd from "./MemberAdd";

import Loading from "../Loading/Loading";
import { getJwt } from "../../utils/auth";

export default function AddProject(props) {
  const { history } = props;

  const [addProjectMutation] = useMutation(ADD_PROJECT);

  let inputName;
  let inputDescription;

  ///member params
  const [selectedMemberProject, setSelectedMemberProject] = useState([]);
  const members =
    Object.keys(selectedMemberProject).length !== 0 &&
    Object.keys(selectedMemberProject).length !== undefined;
  const registerMember = name => {
    setSelectedMemberProject(name);
  };

  //admin params
  const [selectedAdminProject, setSelectedAdminProject] = useState([]);
  const admins =
    Object.keys(selectedAdminProject).length !== 0 &&
    Object.keys(selectedAdminProject).length !== undefined;
  const registerAdmin = name => {
    setSelectedAdminProject(name);
  };

  //init list
  const userInfo = getJwt();
  if (userInfo === undefined) return <p>Loading...</p>;
  // TODO: FIX THIS RUNNING CONDITIONS
  const {
    loading: loadingUsers,
    error: errorUsers,
    data: dataUsers
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useQuery(GET_LIST_USER_QUERY, {
    // No choice for running conditions we have to wait userInfos
    variables: { user: userInfo.user.id },
    fetchPolicy: "cache-and-network"
  });
  if (loadingUsers) return <p>Loading...</p>;
  if (errorUsers) return <p>Error: {errorUsers.message}</p>;

  //filter list
  let filterData = [];
  if (selectedMemberProject.length > 0 && selectedAdminProject.length === 0) {
    for (
      let indexMember = 0;
      indexMember < selectedMemberProject.length;
      indexMember++
    ) {
      if (indexMember === 0) {
        filterData = dataUsers.user.filter(
          user => user !== selectedMemberProject[indexMember]
        );
      } else {
        filterData = filterData.filter(
          user => user !== selectedMemberProject[indexMember]
        );
      }
    }
  } else if (
    selectedAdminProject.length > 0 &&
    selectedMemberProject.length === 0
  ) {
    for (let index = 0; index < selectedAdminProject.length; index++) {
      if (index === 0) {
        filterData = dataUsers.user.filter(
          user => user !== selectedAdminProject[0]
        );
      } else {
        filterData = filterData.filter(
          user => user !== selectedAdminProject[index]
        );
      }
    }
  } else if (
    selectedMemberProject.length > 0 &&
    selectedAdminProject.length > 0
  ) {
    for (let i = 0; i < selectedMemberProject.length; i++) {
      for (let j = 0; j < selectedAdminProject.length; j++) {
        if (i === 0 && j === 0) {
          filterData = dataUsers.user.filter(
            user =>
              user !== selectedMemberProject[0] &&
              user !== selectedAdminProject[0]
          );
        } else {
          filterData = filterData.filter(
            user =>
              user !== selectedMemberProject[i] &&
              user !== selectedAdminProject[j]
          );
        }
      }
    }
  } else {
    filterData = dataUsers.user;
  }

  return (
    <Fragment>
      {history &&
      (history[history.length - 2] === "/login" ||
        history[history.length - 2] === "/verif") ? (
        <Loading />
      ) : (
        ""
      )}
      <div>
        <h1>Nom et description</h1>
        <form
          onSubmit={async e => {
            e.preventDefault();

            //member owner
            const owners = selectedMemberProject.map(obj => ({
              writer_id: obj.id,
              unique_writer: inputName.value + "_" + obj.id
            }));

            //admin owner
            const ownersAdminsInit = selectedAdminProject.map(obj => ({
              administrator_id: obj.id,
              unique_administrator: inputName.value + "_" + obj.id
            }));
            const ownersAdmins = ownersAdminsInit.concat({
              administrator_id: userInfo.user.id,
              unique_administrator: inputName.value + "_" + userInfo.user.id
            });

            //add project
            const returningProject = await addProjectMutation({
              variables: {
                name: inputName.value,
                description: inputDescription.value,
                create_by: userInfo.user.id,
                members: owners,
                administrators: ownersAdmins
              },
              refetchQueries: [{ query: GET_LIST_PROJECT_QUERY }]
            });

            Router.push(
              "/project/[id]/research",
              `/project/${returningProject.data.insert_project.returning[0].id}/research`
            );
          }}
        >
          <div className="form-group">
            <h4>Nom du projet</h4>
            <FormControl
              required
              size="lg"
              className="mt-3 col-md-4 col-sm-12"
              ref={node => {
                inputName = node;
              }}
              placeholder="Nom du projet ..."
              aria-label="Username"
            />
          </div>
          <div className="form-group">
            <h4>Description du projet</h4>
            <FormControl
              required
              className="mt-3 col-md-4 col-sm-12"
              size="lg"
              ref={node => {
                inputDescription = node;
              }}
              placeholder="Ex : Ce projet a pour objectif de …"
              as="textarea"
              aria-label="With textarea"
            />
          </div>
          <h1>Rédacteurs</h1>
          <Row className="align-items-center ml-0">
            <div className="home ml-0">
              <MemberAdd
                selectedMemberProject={selectedMemberProject}
                filterData={filterData}
                registerMember={registerMember}
                members={members}
                name={"rédacteur"}
              />
            </div>
          </Row>
          <h1>Administrateurs</h1>
          <Row className="align-items-center ml-0">
            <div className="home ml-0">
              <AdminAdd
                selectedAdminProject={selectedAdminProject}
                filterData={filterData}
                registerAdmin={registerAdmin}
                admins={admins}
                name={"administrateur"}
              />
            </div>
          </Row>
          <Row className="ml-0">
            <Button
              className="mt-5 ml-0 custom"
              variant="secondary"
              type="submit"
            >
              Créer
            </Button>
          </Row>
        </form>
        <style jsx>{`
          .home {
            text-align: left;
            padding: 0;
            width: 100%;
          }
        `}</style>
      </div>
    </Fragment>
  );
}
AddProject.propTypes = {
  history: PropTypes.array
};
