import { useQuery } from "@apollo/react-hooks";
import React from "react";
import ElasticResearch from "./ElasticResearch";

import { GET_LIST_ARTICLES_QUERY } from "./queries";

export default function ElasticResearchIndex(props) {
  const {
    loading: loadingArticles,
    error: errorArticles,
    data: dataArticles
  } = useQuery(GET_LIST_ARTICLES_QUERY, {
    variables: { project: props.projet },
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
    <ElasticResearch
      projet={props.projet}
      moderatedArticles={moderatedArticles}
    />
  );
}
