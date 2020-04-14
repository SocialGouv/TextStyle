import gql from "graphql-tag";

export const GET_LIST_REVISION_ARTICLES_QUERY = gql`
  query GET_LIST_ARTICLES_QUERY($skip: Int, $first: Int, $project: Int) {
    article(
      offset: $skip
      limit: $first
      order_by: { id: desc }
      where: { project: { _eq: $project }, status: { _eq: 2 } }
    ) {
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

export const GET_LIST_COMMENT_ARTICLE_QUERY = gql`
  query GET_LIST_COMMENT_ARTICLE_QUERY($user: Int, $article: Int) {
    article_comment(
      where: {
        article_id: { _eq: $article }
        user_id: { _eq: $user }
        reply_id: { _is_null: true }
      }
    ) {
      comment
      id
      user_id
      article_id
      created_at
      responses {
        comment
        id
        created_at
        user {
          id
          firstName
          lastName
        }
        responses {
          comment
          id
          created_at
          user {
            id
            firstName
            lastName
          }
        }
      }
      user {
        firstName
        lastName
      }
    }
  }
`;

export const EDIT_COMMENT = gql`
  mutation EDIT_COMMENT($id: Int!, $comment: String) {
    update_article_comment(
      where: { id: { _eq: $id } }
      _set: { comment: $comment }
    ) {
      affected_rows
      returning {
        comment
      }
    }
  }
`;

export const INSERT_COMMENT = gql`
  mutation INSERT_COMMENT(
    $article: Int!
    $comment: String
    $user: Int
    $reply: Int
  ) {
    insert_article_comment(
      objects: {
        article_id: $article
        comment: $comment
        reply_id: $reply
        user_id: $user
      }
    ) {
      affected_rows
    }
  }
`;

export const GET_USER_PROJECT_QUERY = gql`
  query GET_USER_PROJECT_QUERY($project: Int) {
    project(where: { id: { _eq: $project } }) {
      project_writers {
        user {
          id
          firstName
          lastName
        }
      }
      project_administrators {
        administrator {
          firstName
          lastName
          id
        }
      }
    }
  }
`;
