import React from "react";
import ListProject from "../components/Projects/ListProject";
import { withAuthSync } from "../utils/auth";
import PropTypes from "prop-types";

function Index(props) {
  const { history } = props;
  return (
    <div>
      <ListProject history={history} />
    </div>
  );
}

Index.propTypes = {
  history: PropTypes.array
};

export default withAuthSync(Index);
