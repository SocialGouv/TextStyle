import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { withRouter } from "next/router";
//import { PER_PAGE as perPage } from "../../config/config";
import ListItems from "./ListItemsRevision";
import {
  GET_LIST_REVISION_ARTICLES_QUERY,
  GET_USER_PROJECT_QUERY
} from "./queries";
import PropTypes from "prop-types";
import Header from "../Projects/Header";

function IndexRevision(props) {
  const { project } = props;

  const {
    loading: loadingArticles,
    error: errorArticles,
    data: data,
    fetchMore: fetchMore,
    networkStatus: networkStatus
  } = useQuery(GET_LIST_REVISION_ARTICLES_QUERY, {
    variables: {
      skip: 0,
      first: 2,
      project: project
    },
    fetchPolicy: "network-only"
  });

  const {
    loading: loadingUserConfig,
    error: errorUserConfig,
    data: userdata
  } = useQuery(GET_USER_PROJECT_QUERY, {
    variables: {
      project: project
    },
    fetchPolicy: "network-only"
  });

  if (loadingUserConfig) return <p>Loading...</p>;
  if (errorUserConfig) return <p>Error: {errorUserConfig.message}</p>;

  if (loadingArticles && networkStatus !== 3) return <p>Loading...</p>;
  if (errorArticles) return <p>Error: {errorArticles.message}</p>;

  return (
    <div>
      <Header project={project} />
      <ListItems
        listRevision={data || []}
        userList={userdata || []}
        onLoadMore={() =>
          fetchMore({
            variables: {
              skip: data.article.length
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return Object.assign({}, prev, {
                article: [...prev.article, ...fetchMoreResult.article]
              });
            }
          })
        }
      />
    </div>
  );
}

IndexRevision.propTypes = {
  project: PropTypes.string
};

export default withRouter(IndexRevision);
