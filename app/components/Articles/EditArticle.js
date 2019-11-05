import { useMutation } from '@apollo/react-hooks';
import { FaTrashAlt, FaCheck, FaBan } from 'react-icons/fa'
import { DELETE_ARTICLE, EDIT_ARTICLE } from './queries'

export default function EditArticle(props) {
  const [editArticle, { loading: editLoading, error: editError },] = useMutation(EDIT_ARTICLE);
  const [deleteArticle, { loading: deleteLoading, error: deleteError },] = useMutation(DELETE_ARTICLE);


  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          editArticle({ variables: { id: props.id, enabled: !props.enabled } });
        }}
      >
        <button className={props.enabled ? "deleteButton" : "deleteButton createButton"} type="submit"> {props.enabled ? <FaBan /> : <FaCheck />}
        </button>
      </form>
      {editLoading && <p>Loading...</p>}
      {editError && <p>Error :(</p>}

      <form
        onSubmit={e => {
          e.preventDefault();
          deleteArticle({ variables: { id: props.id } });
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