import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const ADD_ARTICLE = gql`
  mutation addArticle($titre: String,$texte: String,$number: String, $article_id: String,$enabled: Boolean) {
    insert_article(objects: [{titre: $titre,texte: $texte,number: $number, article_id: $article_id,enabled: $enabled}]) {
      returning{ 
        id
        titre
        texte
        number
        article_id
        enabled}
    }
  }
`;

const GET_ARTICLE = gql`
  query getArticle($skip: Int!,$enabled : Boolean) {
    article(offset: $skip, limit: 2, where: {enabled: {_eq: $enabled}}) {
      id
      article_id
      enabled
      number
      texte
      titre
    }
    article_aggregate(where: {enabled: {_eq: $enabled}}) {
      aggregate {
        count
      }
    }  
}
`;

export default function AddArticle(variables) {
    const [addArticle, { data }] = useMutation(ADD_ARTICLE);
    return (
      <div className="float-left mr-3">
        <form
          onSubmit={e => {
            e.preventDefault();
            console.log(variables);
            addArticle({ variables: { titre: variables.titre,texte: variables.texte,number: variables.number,enabled: variables.enabled,article_id: variables.article_id },
            refetchQueries: {query: GET_ARTICLE} });
          }}
        >
          <button className={variables.classButton} type="submit">{variables.button}</button>
        </form>
      </div>
      
    );
  }