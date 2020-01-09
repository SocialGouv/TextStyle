import React from "react";
import PropTypes from "prop-types";
import Index from "../../../components/Articles/IndexArticle";
import { withAuthSync } from "../../../utils/auth";

const ArticlesIndex = props => (
  <Index project={props.id} status={props.status} />
);

ArticlesIndex.getInitialProps = async function(context) {
  const { id, status } = context.query;

  return { id, status };
};

ArticlesIndex.propTypes = {
  id: PropTypes.string,
  status: PropTypes.string
};

export default withAuthSync(ArticlesIndex);
