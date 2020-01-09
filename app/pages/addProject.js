import React from "react";
import AddProject from "../components/Projects/AddProject";
import Container from "react-bootstrap/Container";
import { withAuthSync } from "../utils/auth";

function PageAddProject() {
  return (
    <div>
      <header>
        <h2>Ajoutez un projet</h2>
      </header>
      <Container fluid className="p-0">
        <AddProject />
      </Container>
    </div>
  );
}

export default withAuthSync(PageAddProject);
