import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { FaRegClock } from "react-icons/fa";
import { MdCheck } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import PropTypes from "prop-types";

import { EDIT_ARTICLE } from "./queries";

function statusReturn(status) {
  if (status === 0) {
    return [
      2,
      "Êtes vous sur de vouloir accepter l'article ?",
      "createButton listCreateButton",
      <MdCheck key="0" size={22} />,
      1,
      "Êtes vous sur de vouloir mettre en attente l'article ?",
      "waitingButton listWaitingButton",
      <FaRegClock key="0" size={22} />
    ];
  } else if (status === 1) {
    return [
      2,
      "Êtes vous sur de vouloir accepter l'article ?",
      "createButton listCreateButton",
      <MdCheck key="0" size={22} />,
      0,
      "Êtes vous sur de vouloir refuser l'article ?",
      "deleteButton listDeleteButton",
      <IoMdClose key="0" size={22} />
    ];
  } else if (status === 2) {
    return [
      1,
      "Êtes vous sur de vouloir mettre en attente l'article ?",
      "waitingButton listWaitingButton",
      <FaRegClock key="0" size={22} />,
      0,
      "Êtes vous sur de vouloir refuser l'article ?",
      "deleteButton listDeleteButton",
      <IoMdClose key="0" size={22} />
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
  // const [
  //   deleteArticle,
  //   { loading: deleteLoading, error: deleteError }
  // ] = useMutation(DELETE_ARTICLE);
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
        <button className={editionStatus[2]} type="submit">
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
        <button className={editionStatus[6]} type="submit">
          {editionStatus[7]}
        </button>
      </form>
      {waitLoading && <p>Loading...</p>}
      {waitError && waitError.message}
    </div>
  );
}

EditArticle.propTypes = {
  id: PropTypes.number,
  status: PropTypes.number
};
