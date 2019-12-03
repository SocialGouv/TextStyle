import { useMutation } from "@apollo/react-hooks";
import React from "react";
import { FaCheck, FaBan, FaClock } from "react-icons/fa";
import { ADD_ARTICLE } from "./queries";

function chooseStatus(status) {
  if (status === 0) {
    return [
      "Êtes vous sur de vouloir refuser l'article ?",
      "deleteButton searchDelete",
      <FaBan key="0" />
    ];
  } else if (status === 1) {
    return [
      "Êtes vous sur de vouloir mettre en attente l'article ?",
      "waitingButton searchWaiting",
      <FaClock key="0" />
    ];
  } else if (status === 2) {
    return [
      "Êtes vous sur de vouloir accepter l'article ?",
      "createButton",
      <FaCheck key="0" />
    ];
  }
}

function updateModeratedArticles(props) {
  var handleUpdateModeratedArticles = props.handleUpdateModeratedArticles;
  handleUpdateModeratedArticles(props.article_id);
}

export default function AddArticle(props) {
  const [addArticle, { loading: addLoading, error: addError }] = useMutation(
    ADD_ARTICLE
  );
  const statusArray = chooseStatus(props.status);
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          updateModeratedArticles(props);
          addArticle({
            variables: {
              titre: props.titre,
              texte: props.texte,
              number: props.number ? props.number : "annexe",
              status: props.status,
              article_id: props.article_id,
              project: props.project,
              unique_article_projet: props.article_id + "-" + props.project
            }
          });
        }}
      >
        <button className={statusArray[1]} type="submit">
          {" "}
          {statusArray[2]}
        </button>
      </form>
      {addLoading && <p>Loading...</p>}
      {addError && addError.message}
    </div>
  );
}
