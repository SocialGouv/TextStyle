import React from "react";
import ElasticResearchIndex from "../../../components/Research/ElasticResearchIndex";
import Link from "next/link";

const ArticlesIndex = props => (
  <div>
    <header className="text-right">
      <Link href={`/project/revision/${props.id}`}>
        <a className="btn btn-primary mr-2">Revision des articles</a>
      </Link>
      <Link href={`/project/${props.id}`}>
        <a className="btn btn-primary">Voir les articles modérés</a>
      </Link>
    </header>
    <ElasticResearchIndex projet={props.id} />
  </div>
);

ArticlesIndex.getInitialProps = async function(context) {
  const { id } = context.query;

  return { id };
};

export default ArticlesIndex;
