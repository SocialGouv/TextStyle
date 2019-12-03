// proxified by express server
export const GRAPHQL_URL =
  typeof window !== "undefined"
    ? window.location.origin + "/graphql-engine/v1/graphql"
    : process.env.GRAPHQL_URL;

export const PER_PAGE = 5;
