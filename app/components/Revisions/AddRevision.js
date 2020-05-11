import { useMutation } from "@apollo/react-hooks";
import React from "react";
import { ADD_ARTICLE_REVISION } from "./queries";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import IndexArticleRevision from "./IndexArticleRevision";

export default function AddRevision(props) {
  const [addArticle, { loading: addLoading, error: addError }] = useMutation(
    ADD_ARTICLE_REVISION
  );
  const date = new Date();
  const optionsDate = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };
  return (
    <div>
      <form
        className="float-right mt-0"
        onSubmit={e => {
          e.preventDefault();

          const editorText = props.text;
          const div = document.createElement("div");
          div.innerHTML = editorText;
          const elementsDeleted = div.getElementsByTagName("del");
          while (elementsDeleted[0]) {
            elementsDeleted[0].parentNode.removeChild(elementsDeleted[0]);
          }
          const textOnly = div.innerHTML.replace(/(<ins[^>]*>|<\/ins>)/g, "");

          addArticle({
            variables: {
              text: props.text,
              textFormatted: textOnly !== "" ? textOnly : props.text,
              article: props.article,
              project: props.project,
              name:
                props.name +
                " - " +
                date.toLocaleDateString("fr-FR", optionsDate)
            },
            refetchQueries: [
              "GET_LIST_REVISION_ARTICLES_QUERY",
              "GET_ARTICLE_QUERY"
            ],
            fetchPolicy: "no-cache"
          });
        }}
      >
        <Button variant="secondary" type="submit">
          Valider la révision
        </Button>
      </form>
      {addLoading && <p>Loading...</p>}
      {addError && addError.message}

      <IndexArticleRevision
        article={props.article}
        handleToUpdate={props.handleToUpdate}
      />
    </div>
  );
}

AddRevision.propTypes = {
  text: PropTypes.string,
  article: PropTypes.number,
  project: PropTypes.number,
  name: PropTypes.string,
  articleRevisions: PropTypes.array,
  handleToUpdate: PropTypes.func
};
