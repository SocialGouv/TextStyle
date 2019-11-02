import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { FaTrashAlt,FaCheck, FaBan } from 'react-icons/fa'

const ADD_ARTICLE = gql`
  mutation CREATE_LIST_ITEM($titre: String!,$texte : String, $number: String,$article_id: String,$enabled: Boolean,$project: Int,$unique_article_projet: String) {
    insert_article(objects: {titre: $titre,enabled: $enabled, article_id: $article_id,texte: $texte,number: $number,project: $project,unique_article_projet: $unique_article_projet}) {
      returning {
        id
        titre
        enabled
        article_id
        texte
        number
      }
    }
  }
`
export default function AddArticle(props) {
  const [addArticle,{ loading: addLoading, error: addError },] = useMutation(ADD_ARTICLE);
  return (
    <div>
    <form
        onSubmit={e => {
          e.preventDefault();
          addArticle({ variables: { titre: props.titre,texte: props.texte,number: props.number,enabled: props.enabled,article_id: props.article_id, project: props.project, unique_article_projet: props.article_id + '-' + props.project }});
        }}
      >
        <button onClick={() => confirm(props.enabled ? "Êtes vous sur de vouloir accepter l\'article ?" : "Êtes vous sur de vouloir refuser l\'article ?" )} className={props.enabled ? "createButton" : "deleteButton" } type="submit"> {props.enabled ?  <FaCheck/> : <FaBan /> }
    </button>
      </form>
      {addLoading && <p>Loading...</p>}
      {addError && addError.message}
    </div>
  );
}