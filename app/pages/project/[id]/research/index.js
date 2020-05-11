import React from "react";
import PropTypes from "prop-types";
import ElasticResearchIndex from "../../../../components/Research/ResearchIndex";
import { withAuthSync } from "../../../../utils/auth";
import { useQuery } from "@apollo/react-hooks";
import { GET_LIST_ARTICLES_QUERY } from "../../../../components/Research/queries";

function ResearchIndex(props) {
  const {
    loading: loadingArticles,
    error: errorArticles,
    data: dataArticles
  } = useQuery(GET_LIST_ARTICLES_QUERY, {
    variables: { project: props.id },
    fetchPolicy: "cache-and-network"
  });

  if (loadingArticles) return <p>Loading...</p>;
  if (errorArticles) {
    return <p>Error: {errorArticles.message}</p>;
  }
  const moderatedArticles = [];
  if (dataArticles) {
    dataArticles.article.forEach(function(item) {
      //get the value of name
      var val = item.article_id;
      //push the name string in the array
      moderatedArticles.push(val);
    });
  }
  return (
    <ElasticResearchIndex
      project={props.id}
      moderatedArticles={moderatedArticles}
    />
  );
}

ResearchIndex.getInitialProps = async function(context) {
  const { id } = context.query;

  return { id };
};

ResearchIndex.propTypes = {
  id: PropTypes.string
};

export default withAuthSync(ResearchIndex);
