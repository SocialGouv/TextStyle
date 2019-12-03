import React from "react";
import Link from "next/link";
import { useQuery } from "@apollo/react-hooks";
import { withRouter } from "next/router";
import ListItems from "./ListItemsRevision";
import { GET_LIST_REVISION_ARTICLES_QUERY } from "./queries";

function IndexArticle(props) {
  const {
    loading: loadingArticles,
    error: errorArticles,
    data: data
  } = useQuery(GET_LIST_REVISION_ARTICLES_QUERY, {
    variables: {
      project: props.router.query.id
    },
    fetchPolicy: "cache-and-network"
  });

  if (loadingArticles) return <p>Loading...</p>;
  if (errorArticles) return <p>Error: {errorArticles.message}</p>;

  return (
    <div>
      <header>
        <Link href={`/project/${props.router.query.id}`}>
          <a className="btn btn-primary float-right">
            Voir les articles modérés
          </a>
        </Link>
        <Link href={`/project/research/${props.router.query.id}`}>
          <a className="btn btn-primary float-right mr-2">
            Ajouter des articles
          </a>
        </Link>
        <h2>Liste des révisions</h2>
      </header>
      <ListItems listRevision={data} />
    </div>
  );
}

export default withRouter(IndexArticle);
