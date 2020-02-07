import gql from "graphql-tag";

export const GET_LIST_PROJECT_QUERY = gql`
  query GET_LIST_PROJECT_QUERY {
    project(order_by: { id: desc }) {
      id
      name
      description
      create_at
    }
  }
`;
export const GET_LIST_USER_QUERY = gql`
  query GET_LIST_USER_QUERY($user: Int) {
    user(where: { id: { _neq: $user } }) {
      id
      username
      email
      firstName
      lastName
      ministry
      management
    }
  }
`;
export const GET_LIST_NOT_USERS_QUERY = gql`
  query GET_LIST_USER_QUERY($users: [Int!]) {
    user(where: { _not: { id: { _in: $users } } }) {
      id
      username
      email
      firstName
      lastName
      ministry
      management
    }
  }
`;
export const GET_PROJECT_QUERY = gql`
  query GET_PROJECT_QUERY($project: Int) {
    project(where: { id: { _eq: $project } }) {
      name
    }
  }
`;

export const ADD_PROJECT = gql`
  mutation AddProject(
    $name: String!
    $description: String!
    $create_by: Int
    $membres: [project_writer_insert_input!]!
    $adminstrateurs: [project_administrator_insert_input!]!
  ) {
    insert_project(
      objects: [
        {
          name: $name
          description: $description
          create_by: $create_by
          project_administrators: { data: $adminstrateurs }
          project_writers: { data: $membres }
        }
      ]
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`;
