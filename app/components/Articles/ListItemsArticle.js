import React from 'react'
import EditArticle from './EditArticle'

export default function ListItems(props) {
  const { listItems } = props;
  return (
    <div>
      {listItems && listItems.map((listItem) => (
        <div
          key={listItem.id}
          className={listItem.enabled ? 'list-item' : 'list-item denied'}
        >
          <h3>{listItem.titre}</h3>
          <h5>Article numéro : {listItem.number}</h5>
          <p>{listItem.texte}</p>
          <EditArticle enabled={listItem.enabled} id={listItem.id} />
        </div>
      ))}
    </div>
  );
}