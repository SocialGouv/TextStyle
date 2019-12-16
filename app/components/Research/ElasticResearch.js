import React from "react";
import {
  ReactiveBase,
  DataSearch,
  ReactiveList
} from "@appbaseio/reactivesearch";
import ListElastic from "./ListElastic";
import Select from "react-select";
import PropTypes from "prop-types";

// proxified by express server. full absolute URL needed here

const selectOptions = [
  { value: "health", label: "Code de la santé publique" },
  { value: "work", label: "Code du travail" },
  { value: "familly", label: "Code de l'action sociale et des familles" },
  { value: "socialSecurity", label: "Code de la sécurité sociale" },
  { value: "loda", label: "Article non codifiés" },
  { value: "lois", label: "Lois" },
  { value: "decrets", label: "Decrets" }
];
// const ELASTIC_URL = "http://127.0.0.1:9200";

const ELASTIC_URL =
  typeof window !== "undefined"
    ? window.location.origin + "/elastic"
    : process.env.ELASTIC_URL;

function createShouldFilter(selectedOption) {
  var shouldArray = [];
  if (selectedOption) {
    selectedOption.forEach(element => {
      if (element.value === "health") {
        shouldArray.push({
          match_phrase: {
            "context.titreTxt.titre": "Code de la santé publique"
          }
        });
      } else if (element.value === "work") {
        shouldArray.push({
          match_phrase: {
            "context.titreTxt.titre": "Code du travail"
          }
        });
      } else if (element.value === "familly") {
        shouldArray.push({
          match_phrase: {
            "context.titreTxt.titre": "Code de l'action sociale et des familles"
          }
        });
      } else if (element.value === "socialSecurity") {
        shouldArray.push({
          match_phrase: {
            "context.titreTxt.titre": "Code de la sécurité sociale"
          }
        });
      } else if (element.value === "loda") {
        shouldArray.push({
          match_phrase: {
            _index: "iteration"
          }
        });
      }
      // else if (element.value === "lois") {
      //   shouldArray.push({
      //     match_phrase: {
      //       lawTitle: "Loi"
      //     }
      //   });
      // } else if (element.value === "decrets") {
      //   shouldArray.push({
      //     match_phrase: {
      //       lawTitle: "Décret"
      //     }
      //   });
      // }
    });
  }

  return shouldArray;
}

export default class ElasticResearch extends React.Component {
  constructor(props) {
    super(props);
    var searchString = localStorage.getItem(`elasticResearch-${props.projet}`);
    var searchFilter = JSON.parse(
      localStorage.getItem(`elasticFilter-${props.projet}`)
    );
    this.state = {
      projet: props.projet,
      moderatedArticles: props.moderatedArticles,
      searchString: searchString ? searchString : " ",
      selectedOption: searchFilter ? searchFilter : null
    };

    // @TODO: Clean this in proper way
    setTimeout(() => {
      if (this.state.searchString === " ") {
        this.setState({
          searchString: ""
        });
      }
    }, 1);
  }

  queryElastic(value) {
    const shouldArray = createShouldFilter(this.state.selectedOption);
    let shouldMinimum = 0;
    if (shouldArray && shouldArray.length > 0) {
      shouldMinimum = 1;
    }
    return {
      query: {
        bool: {
          must: {
            multi_match: {
              query: value,
              fields: [
                "article.content",
                "lawTitle",
                "texte",
                "num",
                "lawVisa"
              ],
              type: "phrase_prefix",
              operator: "and"
            }
          },
          should: shouldArray,
          minimum_should_match: shouldMinimum,
          must_not: [
            {
              terms: {
                _id: this.state.moderatedArticles
              }
            }
          ]
        }
      }
    };
  }

  emulateChangeOnSearch() {
    // trick to refresh the search
    let tempString;
    if (
      this.state.searchString.charAt(this.state.searchString.length - 1) === " "
    ) {
      tempString = this.state.searchString.slice(0, -1);
    } else {
      tempString = this.state.searchString + " ";
    }

    this.setState({
      searchString: tempString
    });
  }

  handleSelectChange = selectedOption => {
    this.setState({ selectedOption: selectedOption });
    localStorage.setItem(
      `elasticFilter-${this.state.projet}`,
      JSON.stringify(selectedOption)
    );
    this.emulateChangeOnSearch();
  };

  handleUpdateModeratedArticles = someArg => {
    this.setState(prevState => ({
      moderatedArticles: [...prevState.moderatedArticles, someArg]
    }));
    this.emulateChangeOnSearch();
  };

  render() {
    const { selectedOption } = this.state;
    return (
      <div>
        <ReactiveBase url={ELASTIC_URL} app="iteration,index">
          <DataSearch
            className="searchBoxElastic"
            componentId="searchbox"
            dataField={["article.content", "lawTitle", "texte", "num"]}
            placeholder="Recherche dans le contenu ou le titre"
            debounce={0}
            queryFormat="and"
            showFilter={true}
            filterLabel="Venue filter"
            URLParams={false}
            // defaultValue=" "
            value={this.state.searchString}
            onChange={(value, triggerQuery) => {
              localStorage.setItem(
                `elasticResearch-${this.state.projet}`,
                value
              );
              this.setState({ searchString: value }, () => triggerQuery());
            }}
            autosuggest={false}
            customQuery={value => this.queryElastic(value)}
            react={{
              and: ["result"]
            }}
            showClear={true}
          />
          <Select
            isMulti
            name="multiSelect"
            options={selectOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            value={selectedOption}
            onChange={this.handleSelectChange}
            placeholder="Tous les articles"
            closeMenuOnSelect={false}
            noOptionsMessage={() => "Il n'y a plus de filtre"}
          />
          <ReactiveList
            className="resultElastic"
            componentId="result"
            title="Results"
            dataField="lawTitle"
            pagination={false}
            react={{
              and: ["searchbox", "multiList"]
            }}
            renderError={error => (
              <div>
                Une erreur est survenue : <br />
                {error}
              </div>
            )}
            renderResultStats={function(stats) {
              return (
                <div className="resultNumber">
                  Il y a {stats.numberOfResults} résultats
                </div>
              );
            }}
            renderNoResults={() => (
              <div className="resultNumber">Aucun résultat trouvé.</div>
            )}
            renderItem={item => {
              return (
                <ListElastic
                  key={item.id}
                  item={item}
                  project={this.state.projet}
                  handleUpdateModeratedArticles={
                    this.handleUpdateModeratedArticles
                  }
                />
              );
            }}
          />
        </ReactiveBase>
      </div>
    );
  }
}

ElasticResearch.propTypes = {
  projet: PropTypes.string,
  moderatedArticles: PropTypes.array
};
