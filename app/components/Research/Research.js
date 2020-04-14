import React, { useState } from "react";
import PropTypes from "prop-types";
import cookie from "js-cookie";

const Search = props => {
  const [searchValue, setSearchValue] = useState(
    props.searchString ? props.searchString : ""
  );

  const handleSearchInputChanges = e => {
    cookie.set(`elasticResearch-${props.project}`, e.target.value, {
      expires: 300
    });
    setSearchValue(e.target.value);
  };

  const callSearchFunction = e => {
    e.preventDefault();
    props.search(searchValue);
  };

  return (
    <form className="search">
      <input
        value={searchValue}
        onChange={handleSearchInputChanges}
        type="text"
      />
      <input onClick={callSearchFunction} type="submit" value="SEARCH" />
    </form>
  );
};

Search.propTypes = {
  searchString: PropTypes.string,
  project: PropTypes.string,
  search: PropTypes.func
};

export default Search;
