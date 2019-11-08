import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { FaTrashAlt, FaCheck, FaBan, FaClock } from "react-icons/fa";
import { DELETE_ARTICLE, EDIT_ARTICLE } from "./queries";

function statusReturn(status) {
  if (status === 0) {
    return [
      1,
      "Êtes vous sur de vouloir mettre en attente l'article ?",
      "waitingButton listWaitingButton",
      <FaClock key="0" />,
      2,
      "Êtes vous sur de vouloir accepter l'article ?",
      "createButton listCreateButton",
      <FaCheck key="0" />
    ];
  } else if (status === 1) {
    return [
      0,
      "Êtes vous sur de vouloir refuser l'article ?",
      "deleteButton listDeleteButton",
      <FaBan key="0" />,
      2,
      "Êtes vous sur de vouloir accepter l'article ?",
      "createButton listCreateButton",
      <FaCheck key="0" />
    ];
  } else if (status === 2) {
    return [
      0,
      "Êtes vous sur de vouloir refuser l'article ?",
      "deleteButton listDeleteButton",
      <FaBan key="0" />,
      1,
      "Êtes vous sur de vouloir mettre en attente l'article ?",
      "waitingButton listWaitingButton",
      <FaClock key="0" />
    ];
  }
}

export default function EditArticle(props) {
  const [editArticle, { loading: editLoading, error: editError }] = useMutation(
    EDIT_ARTICLE
  );
  const [waitArticle, { loading: waitLoading, error: waitError }] = useMutation(
    EDIT_ARTICLE
  );
  const [
    deleteArticle,
    { loading: deleteLoading, error: deleteError }
  ] = useMutation(DELETE_ARTICLE);
  const { id, status } = props;
  var editionStatus = statusReturn(status);

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          editArticle({
            variables: { id: id, status: editionStatus[0] },
            refetchQueries: [
              "GET_LIST_ARTICLES_QUERY",
              "LIST_ITEMS_CONNECTION_QUERY"
            ]
          });
        }}
      >
        <button
          onClick={() => confirm(editionStatus[1])}
          className={editionStatus[2]}
          type="submit"
        >
          {" "}
          {editionStatus[3]}
        </button>
      </form>
      {editLoading && <p>Loading...</p>}
      {editError && editError.message}

      <form
        onSubmit={e => {
          e.preventDefault();
          waitArticle({
            variables: { id: id, status: editionStatus[4] },
            refetchQueries: [
              "GET_LIST_ARTICLES_QUERY",
              "LIST_ITEMS_CONNECTION_QUERY"
            ]
          });
        }}
      >
        <button
          onClick={() => confirm(editionStatus[5])}
          className={editionStatus[6]}
          type="submit"
        >
          {" "}
          {editionStatus[7]}
        </button>
      </form>
      {waitLoading && <p>Loading...</p>}
      {waitError && waitError.message}

      <form
        onSubmit={e => {
          e.preventDefault();
          deleteArticle({
            variables: { id: id },
            refetchQueries: [
              "GET_LIST_ARTICLES_QUERY",
              "LIST_ITEMS_CONNECTION_QUERY"
            ]
          });
        }}
      >
        <button
          onClick={() =>
            confirm("Êtes vous sur de vouloir supprimer cette article ?")
          }
          className="deleteButton"
          type="submit"
        >
          {" "}
          <FaTrashAlt />{" "}
        </button>
        {deleteLoading && <p>Loading...</p>}
        {deleteError && <p>Error :(</p>}
      </form>
    </div>
  );
}
