import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import Link from "next/link";
import { GET_LIST_PROJECT_QUERY } from "./queries";

export default function App() {
  const {
    loading: loadingProjects,
    error: errorProjects,
    data: dataProjects
  } = useQuery(GET_LIST_PROJECT_QUERY, { fetchPolicy: "cache-and-network" });

  if (loadingProjects) return <p>Loading...</p>;
  if (errorProjects) return <p>Error: {errorProjects.message}</p>;

  const projects = dataProjects.project.map(project => (
    <Link key={project.id} href="/project/[id]" as={`/project/${project.id}`}>
      <div className="list-item">
        <h3>{project.name}</h3>
        <p>{project.description}</p>
      </div>
    </Link>
  ));
  return (
    <Fragment>
      <header>
        <h2>Liste des projets</h2>
      </header>
      <ul>{projects}</ul>
    </Fragment>
  );
}
