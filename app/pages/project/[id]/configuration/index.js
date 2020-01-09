import React from "react";
import PropTypes from "prop-types";
import IndexConfiguration from "../../../../components/Configuration/IndexConfiguration";
import { withAuthSync } from "../../../../utils/auth";

const ConfigurationIndex = props => <IndexConfiguration project={props.id} />;

ConfigurationIndex.getInitialProps = async function(context) {
  const { id } = context.query;

  return { id };
};

ConfigurationIndex.propTypes = {
  id: PropTypes.string
};

export default withAuthSync(ConfigurationIndex);
