import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { FaTrashAlt,FaCheck, FaBan } from 'react-icons/fa'


const DELETE_ARTICLE = gql`
  mutation DELETE_ARTICLE($id: Int) {
    delete_article(where: {id: {_eq: $id}}) {
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

const EDIT_ARTICLE = gql`
  mutation EDIT_ARTICLE($id: Int!,$enabled : Boolean) {
    update_article(where: {id: {_eq: $id}}, _set: {enabled: $enabled}) {
      affected_rows
      returning {
        article_id
        enabled
        id
        texte
        number
        titre
      }
    }
  }
`

export default function EditArticle(props) {
    const [editArticle,{ loading: editLoading, error: editError },] = useMutation(EDIT_ARTICLE);
    const [deleteArticle,{ loading: deleteLoading, error: deleteError },] = useMutation(DELETE_ARTICLE);


    return (
      <div>
      <form
          onSubmit={e => {
            e.preventDefault();
            console.log(props.id,props.enabled)
            editArticle({ variables: { id: props.id, enabled: !props.enabled}, refetchQueries: ["GetItemList"] });
          }}
        >
          <button className={props.enabled ? "deleteButton" : "deleteButton createButton" } type="submit"> {props.enabled ? <FaBan /> : <FaCheck/> }
      </button>
        </form>
        {editLoading && <p>Loading...</p>}
        {editError && <p>Error :(</p>}

        <form
        onSubmit={e => {
          console.log(e);
          console.log(props.id)
          e.preventDefault();
          deleteArticle({ variables: { id: props.id} });
        }}
      >
        <button 
      onClick={() => confirm('Êtes vous sur de vouloir supprimer cette article ?')}
      className="delete" type="submit"> <FaTrashAlt /> </button>
      {deleteLoading && <p>Loading...</p>}
        {deleteError && <p>Error :(</p>}
      </form>
      </div>
    );
  }