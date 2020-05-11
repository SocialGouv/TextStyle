import React from "react";
import PropTypes from "prop-types";
import Index from "../../../../components/Difference/IndexDifference";
import { withAuthSync } from "../../../../utils/auth";

const DifferenceIndex = props => <Index project={props.id} />;

DifferenceIndex.getInitialProps = async function(context) {
  const { id } = context.query;

  return { id };
};

DifferenceIndex.propTypes = {
  id: PropTypes.string
};

export default withAuthSync(DifferenceIndex);
