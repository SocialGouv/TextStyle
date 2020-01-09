import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { DELETE_PROJECT_ADMINISTRATOR } from "./queries";
import { useMutation } from "@apollo/react-hooks";

export default function DeleteAdministrator(props) {
  const { administrator, project } = props;
  const [
    deleteAdministrator,
    { loading: deleteLoading, error: deleteError }
  ] = useMutation(DELETE_PROJECT_ADMINISTRATOR);

  return (
    <form
      className="d-inline"
      onSubmit={e => {
        e.preventDefault();
        deleteAdministrator({
          variables: {
            administrator: administrator,
            project: project
          },
          refetchQueries: ["GET_LIST_USER_PROJECT_QUERY"]
        });
      }}
    >
      <Button className="" variant="secondary addRevision" type="submit">
        X
      </Button>
      {deleteLoading && <p>Loading...</p>}
      {deleteError && deleteError.message}
    </form>
  );
}

DeleteAdministrator.propTypes = {
  administrator: PropTypes.number,
  project: PropTypes.string
};
