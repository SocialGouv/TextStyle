import React from "react";
import AddProject from "../components/Projects/AddProject";
import Container from "react-bootstrap/Container";

export default function PageAddProject() {
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
