import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, FormControl, Button } from "react-bootstrap";
import { ADD_PROJECT_WRITER } from "./queries";
import { useMutation } from "@apollo/react-hooks";

export default function AddWriter(props) {
  const { writerList, project } = props;
  const [writer, setWriter] = useState(
    writerList && writerList.length > 0 ? writerList[0].id : ""
  );
  const [addWriter, { loading: addLoading, error: addError }] = useMutation(
    ADD_PROJECT_WRITER
  );

  return (
    <div>
      {writerList && writerList.length > 0 && (
        <form
          className=""
          onSubmit={e => {
            e.preventDefault();
            addWriter({
              variables: {
                writer: writer,
                project: project,
                unique_writer: writer + "_" + project
              },
              refetchQueries: ["GET_LIST_USER_PROJECT_QUERY"]
            });
            const currentWriterList = writerList.filter(
              elem => elem.id !== writer
            );
            if (currentWriterList && currentWriterList.length > 0) {
              setWriter(currentWriterList[0].id);
            }
          }}
        >
          <FormControl
            size="lg"
            className="select-revision mb-4"
            as="select"
            onChange={e => setWriter(e.target.value)}
            value={writer}
            required={true}
          >
            {writerList &&
              writerList.map(user => (
                <option key={user.id} value={user.id}>
                  {user.lastName} {user.firstName} - {user.email}
                </option>
              ))}
          </FormControl>
          <Button
            className="float-right"
            variant="secondary addRevision"
            type="submit"
          >
            Ajouter un utilisateur
          </Button>
        </form>
      )}
      {writerList && writerList.length === 0 && (
        <Card.Title className="text-center">
          Il n&apos;y a plus d&apos;utilisateur à ajouter
        </Card.Title>
      )}
      {addLoading && <p>Loading...</p>}
      {addError && addError.message}
    </div>
  );
}

AddWriter.propTypes = {
  writerList: PropTypes.array,
  project: PropTypes.string
};
