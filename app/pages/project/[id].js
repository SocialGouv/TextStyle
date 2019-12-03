import React from "react";
import Index from "../../components/Articles/IndexArticle";

const ArticlesIndex = props => <Index variable={props.id} />;

ArticlesIndex.getInitialProps = async function(context) {
  const { id } = context.query;

  return { id };
};

export default ArticlesIndex;
