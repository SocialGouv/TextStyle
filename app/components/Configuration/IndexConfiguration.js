import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { withRouter } from "next/router";
import ConfigurationList from "./ConfigurationList";
import { GET_LIST_USER_PROJECT_QUERY } from "./queries";
import PropTypes from "prop-types";
import Header from "../Projects/Header";
import { getJwt } from "../../utils/auth";
import MembresList from "./MembresList";

function IndexConfiguration(props) {
  const { project } = props;
  const userInfo = getJwt();
  const { loading: loadingConfig, error: errorConfig, data: data } = useQuery(
    GET_LIST_USER_PROJECT_QUERY,
    {
      variables: {
        project: project
      },
      fetchPolicy: "network-only"
    }
  );

  if (loadingConfig) return <p>Loading...</p>;
  if (errorConfig) return <p>Error: {errorConfig.message}</p>;
  if (
    data.project.length === 0 ||
    data.project[0].project_administrators.filter(
      e => e.administrator_id === userInfo.user.id
    ).length < 1
  ) {
    return (
      <div>
        <Header project={project} />
        <p>Vous n&apos;avez pas accès à cette page.</p>
      </div>
    ); // reroute if you are not admin of this project
  }
  return (
    <div>
      <Header project={project} />
      <ConfigurationList project={project} />
      <MembresList
        project={project}
        user={data.user}
        administrator={data.project[0].project_administrators}
        writer={data.project[0].project_writers}
      />
    </div>
  );
}

IndexConfiguration.propTypes = {
  project: PropTypes.string
};

export default withRouter(IndexConfiguration);
