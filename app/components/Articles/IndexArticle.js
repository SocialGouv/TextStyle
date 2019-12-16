import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { withRouter } from "next/router";
import { PER_PAGE as perPage } from "../../config/config";
import ListItems from "./ListItemsArticle";
import Header from "../Projects/Header";

import { GET_LIST_ARTICLES_QUERY } from "./queries";
import PropTypes from "prop-types";

function getStatus(status) {
  if (status === "validated") {
    return 2;
  } else if (status === "waiting") {
    return 1;
  } else if (status === "declined") {
    return 0;
  }
}

function IndexArticle(props) {
  const { project, status } = props;
  const {
    loading: loadingArticles,
    error: errorArticles,
    data: dataArticles,
    fetchMore: fetchMore,
    networkStatus: networkStatus
  } = useQuery(GET_LIST_ARTICLES_QUERY, {
    variables: {
      skip: 0,
      first: perPage,
      project: project,
      status: getStatus(status)
    },
    fetchPolicy: "network-only"
  });

  if (loadingArticles && networkStatus !== 3) return <p>Loading...</p>;
  if (errorArticles) return <p>Error: {errorArticles.message}</p>;

  return (
    <div>
      <Header
        project={project}
        revision={true}
        research={true}
        status={status}
      />
      <ListItems
        listItems={dataArticles.article || []}
        status={status}
        numberArticle={dataArticles.article_aggregate.aggregate.count}
        onLoadMore={() =>
          fetchMore({
            variables: {
              skip: dataArticles.article.length
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

IndexArticle.propTypes = {
  project: PropTypes.string,
  status: PropTypes.string
};

export default withRouter(IndexArticle);
