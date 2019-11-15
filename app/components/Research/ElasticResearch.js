import React from "react";
import {
  ReactiveBase,
  CategorySearch,
  ReactiveList
} from "@appbaseio/reactivesearch";
import ListElastic from "./ListElastic";
import { GET_LIST_ARTICLES_QUERY } from "./queries";
import { useQuery } from "@apollo/react-hooks";

// proxified by express server. full absolute URL needed here
const ELASTIC_URL =
  typeof window !== "undefined"
    ? window.location.origin + "/elastic"
    : process.env.ELASTIC_URL;

//http://localhost:9200/"; // Docker networking

function queryElastic(value, moderatedArticles) {
  return {
    query: {
      bool: {
        must: [
          {
            bool: {
              must: [
                {
                  bool: {
                    should: [
                      {
                        multi_match: {
                          query: value,
                          fields: [
                            "article.content",
                            "lawTitle",
                            "texte",
                            "num",
                            "lawVisa"
                          ],
                          type: "cross_fields",
                          operator: "and"
                        }
                      },
                      {
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
                      }
                    ],
                    minimum_should_match: "1"
                  }
                }
              ]
            }
          }
        ],
        must_not: [
          {
            terms: {
              _id: moderatedArticles
            }
          }
        ]
      }
    },
    size: 5,
    _source: { includes: ["*"], excludes: [] },
    from: 0
  };
}

export default function ElasticResearch(props) {
  const {
    loading: loadingArticles,
    error: errorArticles,
    data: dataArticles
  } = useQuery(GET_LIST_ARTICLES_QUERY, {
    variables: { project: props.projet }
  });

  var moderatedArticles = [];
  if (loadingArticles) return <p>Loading...</p>;
  if (errorArticles) return <p>Error: {errorArticles.message}</p>;

  if (dataArticles) {
    dataArticles.article.forEach(function(item) {
      //get the value of name
      var val = item.article_id;
      //push the name string in the array
      moderatedArticles.push(val);
    });
  }

  return (
    <div>
      <ReactiveBase url={ELASTIC_URL} app="iteration,index">
        <CategorySearch
          className="searchBoxElastic"
          componentId="searchbox"
          dataField={["article.content", "lawTitle", "texte", "num"]}
          placeholder="Recherche dans le contenu ou le titre"
          debounce={0}
          queryFormat="and"
          showFilter={true}
          filterLabel="Venue filter"
          URLParams={false}
          autosuggest={false}
          customQuery={function(value) {
            return queryElastic(value, moderatedArticles);
          }}
        />
        <ReactiveList
          className="resultElastic"
          componentId="result"
          title="Results"
          dataField="lawTitle"
          from={0}
          size={5}
          pagination={true}
          react={{
            and: ["searchbox"]
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
          renderItem={function(item) {
            return <ListElastic item={item} project={props.projet} />;
          }}
        />
      </ReactiveBase>
    </div>
  );
}
