import { useMutation } from "@apollo/react-hooks";
import React from "react";
import { ADD_ARTICLE_REVISION } from "./queries";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";

export default function AddRevision(props) {
  const [addArticle, { loading: addLoading, error: addError }] = useMutation(
    ADD_ARTICLE_REVISION
  );
  const date = new Date();
  const optionsDate = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };
  return (
    <div>
      <form
        className="float-right mt-4"
        onSubmit={e => {
          e.preventDefault();
          addArticle({
            variables: {
              text: props.text,
              article: props.article,
              project: props.project,
              name:
                props.name +
                " - " +
                date.toLocaleDateString("fr-FR", optionsDate)
            },
            refetchQueries: ["GET_LIST_REVISION_ARTICLES_QUERY"]
          });
        }}
      >
        <Button variant="secondary addRevision" type="submit">
          Valider la révision
        </Button>
      </form>
      {addLoading && <p>Loading...</p>}
      {addError && addError.message}
    </div>
  );
}

AddRevision.propTypes = {
  text: PropTypes.string,
  article: PropTypes.number,
  project: PropTypes.string,
  name: PropTypes.string
};
