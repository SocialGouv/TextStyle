import React from "react";
import AddProject from "../components/Projects/AddProject";
import Container from "react-bootstrap/Container";
import { withAuthSync, getJwt } from "../utils/auth";
import PropTypes from "prop-types";

function PageAddProject(props) {
  const { history } = props;
  const userInfo = getJwt();
  return (
    <div>
      <header>
        <h2>Ajoutez un projet</h2>
      </header>
      <Container fluid className="p-0">
        <AddProject history={history} userInfo={userInfo} />
      </Container>
    </div>
  );
}
PageAddProject.propTypes = {
  history: PropTypes.array,
  userInfo: PropTypes.object
};
export default withAuthSync(PageAddProject);
