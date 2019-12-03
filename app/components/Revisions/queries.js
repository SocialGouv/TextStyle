import gql from "graphql-tag";

export const GET_LIST_REVISION_ARTICLES_QUERY = gql`
  query GET_LIST_ARTICLES_QUERY($project: Int) {
    article(where: { project: { _eq: $project }, status: { _eq: 2 } }) {
      id
      titre
      status
      article_id
      texte
      number
      project
      article_revisions(order_by: { id: asc }) {
        text
        id
        name
      }
    }
  }
`;

export const ADD_ARTICLE_REVISION = gql`
  mutation ADD_ARTICLE_REVISION(
    $text: String
    $article: Int
    $project: Int
    $name: String
  ) {
    insert_article_revision(
      objects: {
        article: $article
        text: $text
        project: $project
        name: $name
      }
    ) {
      returning {
        id
        article
        text
        project
        name
      }
    }
  }
`;
