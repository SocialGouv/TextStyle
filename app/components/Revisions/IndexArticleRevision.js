import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { withRouter } from "next/router";
import { GET_ARTICLE_QUERY } from "./queries";
import PropTypes from "prop-types";
import SelectRevision from "./SelectRevision";

function IndexArticleRevision(props) {
  const { article } = props;

  const { loading: loadingArticle, error: errorArticle, data: data } = useQuery(
    GET_ARTICLE_QUERY,
    {
      variables: {
        article: article
      },
      refetchQueries: ["GET_LIST_REVISION_ARTICLES_QUERY", "GET_ARTICLE_QUERY"],
      fetchPolicy: "cache-and-network"
    }
  );

  if (loadingArticle) return <p>Loading...</p>;
  if (errorArticle) return <p>Error: {errorArticle.message}</p>;

  return (
    <div>
      <SelectRevision
        articleRevision={data.article[0].article_revisions || []}
        handleToUpdate={props.handleToUpdate}
      />
    </div>
  );
}

IndexArticleRevision.propTypes = {
  article: PropTypes.number,
  handleToUpdate: PropTypes.func
};

export default withRouter(IndexArticleRevision);
