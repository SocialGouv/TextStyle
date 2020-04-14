import React from "react";
import Profile from "../components/user/Profile";
import { withAuthSync, getJwt } from "../utils/auth";
import PropTypes from "prop-types";

function profilePage(props) {
  const { history } = props;
  const userInfo = getJwt();
  if (userInfo === undefined) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <Profile history={history} userInfo={userInfo} />
    </div>
  );
}
profilePage.propTypes = {
  history: PropTypes.array
};
export default withAuthSync(profilePage);
