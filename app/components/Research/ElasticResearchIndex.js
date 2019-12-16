import { useQuery } from "@apollo/react-hooks";
import React, { Fragment } from "react";
import ElasticResearch from "./ElasticResearch";
import Header from "../Projects/Header";

import { GET_LIST_ARTICLES_QUERY } from "./queries";
import PropTypes from "prop-types";

export default function ElasticResearchIndex(props) {
  const { project } = props;
  const {
    loading: loadingArticles,
    error: errorArticles,
    data: dataArticles
  } = useQuery(GET_LIST_ARTICLES_QUERY, {
    variables: { project: project },
    fetchPolicy: "cache-and-network"
  });

  if (loadingArticles) return <p>Loading...</p>;
  if (errorArticles) return <p>Error: {errorArticles.message}</p>;

  var moderatedArticles = [];
  if (dataArticles) {
    dataArticles.article.forEach(function(item) {
      //get the value of name
      var val = item.article_id;
      //push the name string in the array
      moderatedArticles.push(val);
    });
  }

  return (
    <Fragment>
      <Header project={project} revision={true} research={false} />
      <ElasticResearch projet={project} moderatedArticles={moderatedArticles} />
    </Fragment>
  );
}

ElasticResearchIndex.propTypes = {
  project: PropTypes.string
};
