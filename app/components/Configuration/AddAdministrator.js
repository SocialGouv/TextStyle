import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, FormControl, Button } from "react-bootstrap";
import { ADD_PROJECT_ADMINISTRATOR } from "./queries";
import { useMutation } from "@apollo/react-hooks";

export default function AddAdministrator(props) {
  const { administratorList, project } = props;
  const [administrator, setAdministrator] = useState(
    administratorList && administratorList.length > 0
      ? administratorList[0].id
      : ""
  );
  const [
    addAdministrator,
    { loading: addLoading, error: addError }
  ] = useMutation(ADD_PROJECT_ADMINISTRATOR);

  return (
    <div>
      {administratorList && administratorList.length > 0 && (
        <form
          className=""
          onSubmit={e => {
            e.preventDefault();
            addAdministrator({
              variables: {
                administrator: administrator,
                project: project,
                unique_administrator: administrator + "_" + project
              },
              refetchQueries: ["GET_LIST_USER_PROJECT_QUERY"]
            });
            const currentAdministratorList = administratorList.filter(
              elem => elem.id !== administrator
            );
            if (
              currentAdministratorList &&
              currentAdministratorList.length > 0
            ) {
              setAdministrator(currentAdministratorList[0].id);
            }
          }}
        >
          <FormControl
            size="lg"
            className="select-revision mb-4"
            as="select"
            onChange={e => setAdministrator(e.target.value)}
            value={administrator}
            required={true}
          >
            {administratorList &&
              administratorList.map(admin => (
                <option key={admin.id} value={admin.id}>
                  {admin.lastName} {admin.firstName} - {admin.email}
                </option>
              ))}
          </FormControl>
          <Button
            className="float-right"
            variant="secondary addRevision"
            type="submit"
          >
            Ajouter un administrateur
          </Button>
        </form>
      )}
      {administratorList && administratorList.length === 0 && (
        <Card.Title className="text-center">
          Il n&apos;y a plus d&apos;utilisateur à ajouter en administrateur
        </Card.Title>
      )}
      {addLoading && <p>Loading...</p>}
      {addError && addError.message}
    </div>
  );
}

AddAdministrator.propTypes = {
  administratorList: PropTypes.array,
  project: PropTypes.string
};
