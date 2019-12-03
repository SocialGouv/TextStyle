import { useMutation } from "@apollo/react-hooks";
import React from "react";
import { ADD_ARTICLE_REVISION } from "./queries";

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
            }
          });
        }}
      >
        <button className="addRevision" type="submit">
          Valider la révision
        </button>
      </form>
      {addLoading && <p>Loading...</p>}
      {addError && addError.message}
    </div>
  );
}
