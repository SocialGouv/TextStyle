import gql from "graphql-tag";

export const GET_LIST_USER_PROJECT_QUERY = gql`
  query GET_LIST_USER_PROJECT_QUERY($project: Int) {
    project(where: { id: { _eq: $project } }) {
      project_administrators {
        administrator_id
      }
      project_administrators_aggregate {
        aggregate {
          count
        }
      }
      project_writers {
        writer_id
      }
      project_writers_aggregate {
        aggregate {
          count
        }
      }
    }
    user {
      id
      username
      email
    }
  }
`;

export const ADD_PROJECT_ADMINISTRATOR = gql`
  mutation ADD_PROJECT_ADMINISTRATOR(
    $project: Int
    $administrator: Int
    $unique_administrator: String
  ) {
    insert_project_administrator(
      objects: {
        administrator_id: $administrator
        project_id: $project
        unique_administrator: $unique_administrator
      }
    ) {
      returning {
        administrator_id
        id
        project_id
      }
    }
  }
`;

export const ADD_PROJECT_WRITER = gql`
  mutation ADD_PROJECT_WRITER(
    $project: Int
    $writer: Int
    $unique_writer: String
  ) {
    insert_project_writer(
      objects: {
        writer_id: $writer
        project_id: $project
        unique_writer: $unique_writer
      }
    ) {
      returning {
        writer_id
        id
        project_id
      }
    }
  }
`;

export const DELETE_PROJECT_ADMINISTRATOR = gql`
  mutation DELETE_PROJECT_ADMINISTRATOR($project: Int, $administrator: Int) {
    delete_project_administrator(
      where: {
        administrator_id: { _eq: $administrator }
        project_id: { _eq: $project }
      }
    ) {
      affected_rows
    }
  }
`;

export const DELETE_PROJECT_WRITER = gql`
  mutation DELETE_PROJECT_WRITER($project: Int, $writer: Int) {
    delete_project_writer(
      where: { writer_id: { _eq: $writer }, project_id: { _eq: $project } }
    ) {
      affected_rows
    }
  }
`;
