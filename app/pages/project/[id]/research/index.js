import React from "react";
import PropTypes from "prop-types";
import ElasticResearchIndex from "../../../../components/Research/ResearchIndex";
import { withAuthSync } from "../../../../utils/auth";

const ResearchIndex = props => <ElasticResearchIndex project={props.id} />;

ResearchIndex.getInitialProps = async function(context) {
  const { id } = context.query;

  return { id };
};

ResearchIndex.propTypes = {
  id: PropTypes.string
};

export default withAuthSync(ResearchIndex);
