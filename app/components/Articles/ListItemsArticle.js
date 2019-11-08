import React from "react";
import EditArticle from "./EditArticle";

function listItemEnabled(status) {
  if (status === 0) {
    return "list-item denied";
  } else if (status === 1) {
    return "list-item waiting";
  } else if (status === 2) {
    return "list-item";
  }
}
export default function ListItems(props) {
  const { listItems } = props;
  return (
    <div>
      {listItems &&
        listItems.map(listItem => (
          <div key={listItem.id} className={listItemEnabled(listItem.status)}>
            <h3>{listItem.titre}</h3>
            <h5>Article numéro : {listItem.number}</h5>
            <p>{listItem.texte}</p>
            <EditArticle status={listItem.status} id={listItem.id} />
          </div>
        ))}
    </div>
  );
}
