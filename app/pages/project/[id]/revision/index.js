import React from "react";
import PropTypes from "prop-types";
import Index from "../../../../components/Revisions/IndexRevision";
import { withAuthSync } from "../../../../utils/auth";

const RevisionIndex = props => <Index project={props.id} />;

RevisionIndex.getInitialProps = async function(context) {
  const { id } = context.query;

  return { id };
};

RevisionIndex.propTypes = {
  id: PropTypes.string
};

export default withAuthSync(RevisionIndex);
