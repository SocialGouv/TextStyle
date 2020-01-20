import { useMutation } from "@apollo/react-hooks";
import Router from "next/router";
import React from "react";
import { ADD_PROJECT, GET_LIST_PROJECT_QUERY } from "./queries";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import { getJwt } from "../../utils/auth";

export default function AddProject() {
  let inputName;
  let inputDescription;
  const [addProject] = useMutation(ADD_PROJECT);
  const userInfo = getJwt();

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addProject({
            variables: {
              name: inputName.value,
              description: inputDescription.value,
              create_by: userInfo.user.id
            },
            refetchQueries: [GET_LIST_PROJECT_QUERY]
          });
          inputName.value = "";
          inputDescription.value = "";
          Router.push({ pathname: "/" });
        }}
      >
        <div className="form-group">
          <h2>Nom du projet</h2>

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
          <h2>Description du projet</h2>

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
        <Button variant="secondary" type="submit">
          Créer
        </Button>
      </form>
    </div>
  );
}
