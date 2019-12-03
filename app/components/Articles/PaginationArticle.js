import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Link from "next/link";
import { LIST_ITEMS_CONNECTION_QUERY } from "./queries";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { withRouter } from "next/router";
import { PER_PAGE as perPage } from "../../config/config";

function Pagination(props) {
  const projectId = props.router.query.id;
  const page = parseInt(props.router.query.page) || 1;

  const {
    loading: loadingPagination,
    error: errorPagination,
    data: dataPagination
  } = useQuery(LIST_ITEMS_CONNECTION_QUERY, {
    variables: { project: projectId },
    fetchPolicy: "cache-and-network"
  });

  if (loadingPagination) return <p>Loading...</p>;
  if (errorPagination) return <p> Error: {errorPagination.message}</p>;
  const count = dataPagination.article_aggregate.aggregate.count;
  const pages = Math.ceil(count / perPage);
  return (
    <div className="pagination">
      <Link
        href={{
          pathname: `/project/${projectId}`,
          query: { page: page - 1 }
        }}
      >
        <a className="prev" aria-disabled={page <= 1}>
          <FaArrowLeft />
        </a>
      </Link>

      <p>
        Page {page} sur {pages}
      </p>
      <p>{count} articles totaux</p>

      <Link
        href={{
          pathname: `/project/${projectId}`,
          query: { page: page + 1 }
        }}
      >
        <a className="next" aria-disabled={page >= pages}>
          <FaArrowRight />
        </a>
      </Link>
    </div>
  );
}

export default withRouter(Pagination);
