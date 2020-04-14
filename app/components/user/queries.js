import gql from "graphql-tag";

export const GET_USER_QUERY = gql`
  query GET_USER_QUERY($email: String) {
    user(where: { email: { _eq: $email } }) {
      email
      firstName
      lastName
      ministry
      management
    }
  }
`;
export const EDIT_USER = gql`
  mutation EDIT_USER($email: String!, $ministry: String, $management: String) {
    update_user(
      where: { email: { _eq: $email } }
      _set: { ministry: $ministry, management: $management }
    ) {
      affected_rows
      returning {
        email
        firstName
        lastName
        ministry
        management
      }
    }
  }
`;
