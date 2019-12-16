import gql from "graphql-tag";

export const GET_LIST_ARTICLES_QUERY = gql`
  query GET_LIST_ARTICLES_QUERY(
    $skip: Int
    $first: Int
    $project: Int
    $status: Int
  ) {
    article(
      offset: $skip
      limit: $first
      order_by: { id: desc }
      where: { project: { _eq: $project }, status: { _eq: $status } }
    ) {
      id
      titre
      status
      article_id
      texte
      number
    }
    article_aggregate(
      where: { project: { _eq: $project }, status: { _eq: $status } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const DELETE_ARTICLE = gql`
  mutation DELETE_ARTICLE($id: Int) {
    delete_article(where: { id: { _eq: $id } }) {
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

export const LIST_ITEMS_CONNECTION_QUERY = gql`
  query LIST_ITEMS_CONNECTION_QUERY($project: Int) {
    article_aggregate(where: { project: { _eq: $project } }) {
      aggregate {
        count
      }
    }
  }
`;

export const EDIT_ARTICLE = gql`
  mutation EDIT_ARTICLE($id: Int!, $status: Int) {
    update_article(where: { id: { _eq: $id } }, _set: { status: $status }) {
      affected_rows
      returning {
        article_id
        status
        id
        texte
        number
        titre
      }
    }
  }
`;
