import { useMutation } from '@apollo/react-hooks';
import { FaCheck, FaBan } from 'react-icons/fa'
import { ADD_ARTICLE } from './queries'

export default function AddArticle(props) {
  const [addArticle, { loading: addLoading, error: addError },] = useMutation(ADD_ARTICLE);
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addArticle({ variables: { titre: props.titre, texte: props.texte, number: props.number, enabled: props.enabled, article_id: props.article_id, project: props.project, unique_article_projet: props.article_id + '-' + props.project } });
        }}
      >
        <button onClick={() => confirm(props.enabled ? "Êtes vous sur de vouloir accepter l\'article ?" : "Êtes vous sur de vouloir refuser l\'article ?")} className={props.enabled ? "createButton" : "deleteButton"} type="submit"> {props.enabled ? <FaCheck /> : <FaBan />}
        </button>
      </form>
      {addLoading && <p>Loading...</p>}
      {addError && addError.message}
    </div>
  );
}