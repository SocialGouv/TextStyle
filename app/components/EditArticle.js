import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const EDIT_ARTICLE = gql`
  mutation editArticle($id: Int,$enabled: Boolean) {
    update_article(_inc: {id: $id}, _set: {enabled: $enabled}, where: {id: {_eq: $id}}) {
        returning {
            article_id
            enabled
            id
            number
            texte
            titre
          }
}
}
`;

export default function EditArticle(variables) {
    const [addArticle, { data }] = useMutation(EDIT_ARTICLE);
    console.log(variables)
    return (
      <div className="float-left mr-3">
        <form
          onSubmit={e => {
            e.preventDefault();
            console.log(variables);
            addArticle({ variables: { id: variables.id, enabled: variables.enabled} });
          }}
        >
          <button class={variables.classButton} type="submit">{variables.button}</button>
        </form>
      </div>
      
    );
  }