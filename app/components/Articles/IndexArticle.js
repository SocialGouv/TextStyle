import React, { Component } from 'react'
import gql from 'graphql-tag';
import Link from 'next/link'
import { useQuery } from "@apollo/react-hooks";
import { withRouter } from 'next/router'
import { PER_PAGE as perPage } from '../../config/config'
import Pagination from './PaginationArticle'
import ListItems from './ListItemsArticle'
import { GET_LIST_ARTICLES_QUERY } from './queries'

function IndexArticle(props) {
  const { loading: loadingArticles, error: errorArticles, data: dataArticles } = useQuery(
    GET_LIST_ARTICLES_QUERY, { variables: { skip: ((props.router.query.page || 1) - 1) * perPage, first: perPage, project: props.router.query.id } }
  );

  if (loadingArticles) return <p>Loading...</p>;
  if (errorArticles) return <p>There's an error: {errorArticles.message}</p>;

  return (
    <div>
      <header>
        <Link href={'/project/research/' + props.router.query.id} >
          <a className="btn btn-primary float-right">Ajouter des articles</a>
        </Link>
        <h2>Liste des articles</h2>
      </header>
      <Pagination />
      <ListItems listItems={dataArticles.article} />
      <Pagination />
    </div>
  );
}

export default withRouter(IndexArticle)