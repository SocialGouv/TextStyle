import gql from "graphql-tag";

export const GET_LIST_PROJECT_QUERY = gql`
  query GET_LIST_PROJECT_QUERY {
    project {
      id
      name
      description
      create_at
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
  mutation AddProject($name: String!, $description: String!, $create_by: Int) {
    insert_project(
      objects: {
        description: $description
        name: $name
        create_by: $create_by
        project_administrators: { data: { administrator_id: $create_by } }
      }
    ) {
      affected_rows
      returning {
        name
        id
        create_at
        create_by
        description
        project_administrators {
          administrator_id
          id
          project_id
        }
      }
    }
  }
`;
