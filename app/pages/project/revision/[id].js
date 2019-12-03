import React from "react";
import Index from "../../../components/Revisions/IndexRevision";

const RevisionIndex = props => <Index variable={props.id} />;

RevisionIndex.getInitialProps = async function(context) {
  const { id } = context.query;

  return { id };
};

export default RevisionIndex;
