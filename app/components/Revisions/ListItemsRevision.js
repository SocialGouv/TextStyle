import React from "react";
import CkEditor from "./CkEditor";

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
  const { listRevision } = props;
  return (
    <div>
      {listRevision &&
        listRevision.article.map(listItem => (
          <div key={listItem.id} className={listItemEnabled(listItem.status)}>
            <h3>{listItem.titre}</h3>
            <h5>Article numéro : {listItem.number}</h5>
            <div className="row mt-5">
              <div className="col-sm-12 col-md-6">
                <CkEditor readonly={true} article={listItem} />
              </div>
              <div className="col-sm-12 col-md-6">
                <CkEditor readonly={false} article={listItem} />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
