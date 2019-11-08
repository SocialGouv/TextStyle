import gql from "graphql-tag";

export const GET_LIST_ARTICLES_QUERY = gql`
  query GET_LIST_ARTICLES_QUERY($project: Int) {
    article(where: { project: { _eq: $project } }) {
      article_id
    }
  }
`;

export const ADD_ARTICLE = gql`
  mutation CREATE_LIST_ITEM(
    $titre: String!
    $texte: String
    $number: String
    $article_id: String
    $status: Int
    $project: Int
    $unique_article_projet: String
  ) {
    insert_article(
      objects: {
        titre: $titre
        status: $status
        article_id: $article_id
        texte: $texte
        number: $number
        project: $project
        unique_article_projet: $unique_article_projet
      }
    ) {
      returning {
        id
        titre
        status
        article_id
        texte
        number
      }
    }
  }
`;