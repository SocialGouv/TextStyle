import { useMutation } from "@apollo/react-hooks";
import Router from "next/router";
import React from "react";
import { ADD_PROJECT, GET_LIST_PROJECT_QUERY } from "./queries";

export default function AddProject() {
  let inputName;
  let inputDescription;
  const [addProject] = useMutation(ADD_PROJECT);

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addProject({
            variables: {
              name: inputName.value,
              description: inputDescription.value
            },
            refetchQueries: [GET_LIST_PROJECT_QUERY]
          });
          inputName.value = "";
          inputDescription.value = "";
          Router.push({ pathname: "/" });
        }}
      >
        <div className="form-group">
          <p>Nom du projet</p>
          <input
            ref={node => {
              inputName = node;
            }}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <p>Description du projet</p>

          <textarea
            ref={node => {
              inputDescription = node;
            }}
            className="form-control"
          />
        </div>

        <button type="submit">Ajouter le projet</button>
      </form>
    </div>
  );
}
