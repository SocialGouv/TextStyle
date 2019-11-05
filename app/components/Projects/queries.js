import gql from 'graphql-tag';

export const GET_LIST_PROJECT_QUERY = gql`
  query GET_LIST_PROJECT_QUERY {
    project {
      id
      name
      description
    }
  }
`

export const ADD_PROJECT = gql`
    mutation AddProject($name: String!, $description: String!) {
    insert_project(objects: {description: $description, name: $name}) {
      affected_rows
      returning {
        name
        id
        description
      }
    }
  }  
`;