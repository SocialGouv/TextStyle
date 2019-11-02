import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Link from 'next/link';


const GET_LIST_PROJECT_QUERY = gql`
  query GET_LIST_PROJECT_QUERY {
    project {
      id
      name
      description
    }
  }
`
export default function App() {
  const { loading: loadingProjects, error: errorProjects, data: dataProjects } = useQuery(
    GET_LIST_PROJECT_QUERY
  );

  if (loadingProjects) return <p>Loading...</p>;
  if (errorProjects) return <p>There's an error: {errorProjects.message}</p>;
  console.dir(dataProjects);

  const projects = dataProjects.project.map(project => (
    <Link key={project.id} href="/project/[id]" as={`/project/${project.id}`} >
    <div className='list-item'>
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
      <ul>
      {projects}
      </ul>
    </Fragment>
  );
}