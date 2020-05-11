import React, { useReducer, useEffect, useState } from "react";
import Search from "./Research";
import Select from "react-select";
import FullArticle from "./FullArticle";
import { Card, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Header from "../Projects/Header";
import cookie from "js-cookie";
import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

function setCookie(cookieName, project, value) {
  cookie.set(`${cookieName}-${project}`, value, {
    expires: 300
  });
}
const textOptions = [
  { value: "all", label: "Tous les contenus" },
  { value: "code", label: "Codes" },
  { value: "legi", label: "textes consolidés" }
];

const selectOptionsCode = [
  { value: "health", label: "Code de la santé publique" },
  { value: "work", label: "Code du travail" },
  { value: "familly", label: "Code de l'action sociale et des familles" },
  { value: "socialSecurity", label: "Code de la sécurité sociale" }
];

const selectOptionsLegi = [
  { value: "lois", label: "LOI" },
  { value: "decrets", label: "DECRET" }
];
const SEARCH_API_URL = "http://127.0.0.1:3000/api/search";

const initialState = {
  loading: true,
  texts: [],
  errorMessage: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_SUCCESS":
      return {
        ...state,
        loading: false,
        texts: action.payload
      };
    case "SEARCH_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};

const ResearchIndex = props => {
  const { project } = props;

  const searchString = cookie.get(`elasticResearch-${project}`);
  const searchFilterContent = cookie.get(`elasticFilterContent-${project}`);
  const searchFilterDetail = cookie.get(`elasticFilterDetail-${project}`);
  const currentPage = cookie.get(`elasticFilterPage-${project}`);
  const searchFilterDetailOptions = cookie.get(
    `elasticFilterDetailOptions-${project}`
  );
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedText, setSelectedText] = useState(
    searchFilterContent
      ? JSON.parse(searchFilterContent)
      : {
          value: "all",
          label: "Tous les contenus"
        }
  );
  const [totalResult, setTotalResult] = useState(0);
  const [selectedOptionFilter, setSelectedOptionFilter] = useState(
    searchFilterDetail ? JSON.parse(searchFilterDetail) : []
  );
  const [selectedPage, setSelectedPage] = useState(
    currentPage ? currentPage : 0
  );
  const [allPossiblePage, setAllPossiblePage] = useState(
    currentPage ? currentPage : 0
  );
  const [filterOptions, setFilterOptions] = useState(
    searchFilterDetail ? JSON.parse(searchFilterDetailOptions) : []
  );
  const [moderatedArticles, setModeratedArticles] = React.useState(
    props.moderatedArticles
  );

  let firstDisabledFilter = true;

  if (searchFilterContent) {
    const searchFilterContentParse = JSON.parse(searchFilterContent);
    if (
      searchFilterContentParse.value === "code" ||
      searchFilterContentParse.value === "legi"
    ) {
      firstDisabledFilter = false;
    }
  }
  const [disabledFilter, setDisabledFilter] = useState(firstDisabledFilter);

  var data = {
    searchValue: searchString,
    selectedOption: selectedOptionFilter,
    selectedText: selectedText,
    page: selectedPage + 1
  };
  var body = JSON.stringify(data);
  useEffect(() => {
    if (searchString) {
      dispatch({
        type: "SEARCH_REQUEST"
      });
      fetch(SEARCH_API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: body
      })
        .then(response => response.json())
        .then(jsonResponse => {
          const numberResult = jsonResponse.totalResultNumber;
          setTotalResult(numberResult);
          const numberPage = Math.ceil(numberResult / 10);
          setAllPossiblePage(numberPage);
          dispatch({
            type: "SEARCH_SUCCESS",
            payload: jsonResponse
          });
        });
    }
  }, [body, searchString]);

  const handleUpdateModeratedArticles = someArg => {
    setModeratedArticles(oldArray => [...oldArray, someArg]);
  };

  const handleSelectTextChange = selectedOption => {
    setSelectedText(selectedOption);
    setSelectedPage(0);
    setCookie("elasticFilterPage", project, 0);
    setCookie("elasticFilterContent", project, JSON.stringify(selectedOption));
    setCookie("elasticFilterDetail", project, JSON.stringify([]));

    if (selectedOption.value === "code") {
      setSelectedOptionFilter(null);
      setDisabledFilter(false);
      setFilterOptions(selectOptionsCode);

      setCookie(
        "elasticFilterDetailOptions",
        project,
        JSON.stringify(selectOptionsCode)
      );
    } else if (selectedOption.value === "legi") {
      setSelectedOptionFilter(null);
      setDisabledFilter(false);
      setFilterOptions(selectOptionsLegi);

      setCookie(
        "elasticFilterDetailOptions",
        project,
        JSON.stringify(selectOptionsLegi)
      );
    } else {
      setSelectedOptionFilter(null);
      setDisabledFilter(true);
      setCookie("elasticFilterDetailOptions", project, JSON.stringify([]));
    }
  };

  const handleSelectChange = selectedOption => {
    setCookie("elasticFilterDetail", project, JSON.stringify(selectedOption));
    setCookie("elasticFilterPage", project, 0);

    setSelectedPage(0);
    setSelectedOptionFilter(selectedOption);
  };

  const handleSelectPageChange = selectedOption => {
    console.log(selectedOption.selected + 1);
    setCookie("elasticFilterPage", project, selectedOption.selected);
    setSelectedPage(selectedOption.selected);
  };

  const showAllArticle = (code, nor) => {
    if (code) {
      const selectedOption = selectOptionsCode.filter(function(option) {
        return option.label == code;
      });
      setSelectedPage(0);
      setCookie("elasticFilterPage", project, 0);
      setCookie("elasticFilterDetail", project, JSON.stringify(selectedOption));
      setSelectedOptionFilter(selectedOption);
    } else if (nor) {
      return false;
    }
  };

  const search = searchValue => {
    var data2 = {
      searchValue: searchValue,
      selectedOption: selectedOptionFilter,
      selectedText: selectedText,
      page: selectedPage + 1,
      nor: null
    };
    var body2 = JSON.stringify(data2);
    dispatch({
      type: "SEARCH_REQUEST"
    });

    fetch(SEARCH_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: body2
    })
      .then(response => response.json())
      .then(jsonResponse => {
        const numberResult = jsonResponse.totalResultNumber;
        setTotalResult(numberResult);
        const numberPage = Math.ceil(numberResult / 10);
        setAllPossiblePage(numberPage);
        dispatch({
          type: "SEARCH_SUCCESS",
          payload: jsonResponse
        });
      });
  };

  const { texts, errorMessage, loading } = state;

  return (
    <div className="App">
      <Header project={project} />
      <Search search={search} searchString={searchString} project={project} />
      <Select
        name="singleSelect"
        options={textOptions}
        className="basic-multi-select"
        classNamePrefix="select"
        value={selectedText}
        onChange={handleSelectTextChange}
        placeholder="Tous les articles"
        noOptionsMessage={() => "Il n'y a plus de filtre"}
      />
      <Select
        isDisabled={disabledFilter}
        isMulti
        name="multiSelect"
        options={filterOptions}
        className="basic-multi-select"
        classNamePrefix="select"
        value={selectedOptionFilter}
        onChange={handleSelectChange}
        placeholder="Tous les articles"
        closeMenuOnSelect={false}
        noOptionsMessage={() => "Il n'y a plus de filtre"}
      />
      <div className="movies">
        {!loading ||
          (!texts.result && (
            <p>
              Il y a {totalResult} résultat{totalResult > 1 ? "s" : ""}
            </p>
          ))}
        {!loading ||
          (!texts.result && (
            <div id="react-paginate">
              <ReactPaginate
                pageCount={parseInt(allPossiblePage)}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                forcePage={parseInt(selectedPage)}
                onPageChange={handleSelectPageChange}
                previousLabel={<FaAngleLeft></FaAngleLeft>}
                nextLabel={<FaAngleRight></FaAngleRight>}
                breakLabel={"..."}
                breakClassName={"break-me"}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              ></ReactPaginate>
            </div>
          ))}
        {loading && !errorMessage ? (
          <span>loading... </span>
        ) : errorMessage || !texts.result ? (
          <div className="errorMessage">Erreur de l&apos;api</div>
        ) : (
          texts?.results.map((text, index) => {
            let numberArticleReset = 0;
            return (
              <Row className="position-relative" key={index}>
                <div className="text-indicator-blue"></div>
                <Col xs={12} md={12}>
                  <Card className="card-list">
                    <Card.Header
                      dangerouslySetInnerHTML={{
                        __html: text.titles[0].title
                      }}
                      className="custom-header"
                    ></Card.Header>
                  </Card>
                </Col>
                {text.sections.map((section, indexSection) => {
                  return (
                    <div className="w-100 text-section" key={indexSection}>
                      {section.title && (
                        <div className="text-section-indicator"></div>
                      )}
                      <Col xs={12} md={12}>
                        <h3
                          dangerouslySetInnerHTML={{
                            __html: section.title
                          }}
                        ></h3>
                      </Col>
                      {section.extracts.map((article, indexArticle) => {
                        if (article.id) {
                          numberArticleReset++;
                        }
                        return (
                          <FullArticle
                            moderatedArticles={moderatedArticles}
                            reduceArticle={article}
                            key={indexArticle}
                            handleUpdateModeratedArticles={
                              handleUpdateModeratedArticles
                            }
                            project={project}
                          ></FullArticle>
                        );
                      })}
                    </div>
                  );
                })}
                {numberArticleReset === 3 && (
                  <Col xs={12} md={12}>
                    <div className="text-center my-3">
                      <Button
                        onClick={() =>
                          showAllArticle(text.titles[0].title, null)
                        }
                        className="float-none buttonShowAll"
                        type="submit"
                        size="lg"
                      >
                        Voir tous les articles
                      </Button>
                    </div>
                  </Col>
                )}
              </Row>
            );
          })
        )}
      </div>
      {!loading ||
        (!texts.result && (
          <div id="react-paginate">
            <ReactPaginate
              pageCount={parseInt(allPossiblePage)}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              forcePage={parseInt(selectedPage)}
              onPageChange={handleSelectPageChange}
              previousLabel={<FaAngleLeft></FaAngleLeft>}
              nextLabel={<FaAngleRight></FaAngleRight>}
              breakLabel={"..."}
              breakClassName={"break-me"}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            ></ReactPaginate>
          </div>
        ))}
    </div>
  );
};

export default ResearchIndex;

ResearchIndex.propTypes = {
  project: PropTypes.string,
  moderatedArticles: PropTypes.array
};
