import React from 'react';
import {
	ReactiveBase,
	CategorySearch,
	ReactiveList,
} from '@appbaseio/reactivesearch'; 
import AddArticle from './AddArticle'
import gql from 'graphql-tag';

import { useQuery } from '@apollo/react-hooks';

const GET_LIST_ARTICLES_QUERY = gql`
  query GET_LIST_ARTICLES_QUERY($project : Int) {
    article(where: {project: {_eq: $project}}) {
      article_id
    }
  }
`

export default function ElasticResearch(props) {
    // console.log(props);
    const { loading: loadingArticles, error: errorArticles, data: dataArticles } = useQuery(
        GET_LIST_ARTICLES_QUERY, {variables : {project: props.projet}}
      );
      var moderatedArticles = [];
      if (dataArticles){
        dataArticles.article.forEach(function(item) {
            //get the value of name
            var val = item.article_id
            //push the name string in the array
            moderatedArticles.push(val);
            });
      }

    console.dir(moderatedArticles);
    return (
        <div>
        <ReactiveBase
        url="http://localhost:9200/"
        app="iteration,index"
        >
            <CategorySearch
                className="searchBoxElastic"
                componentId="searchbox"
                dataField={['article.content','lawTitle','texte','num']}
                placeholder="Recherche dans le contenu ou le titre"
                debounce={0}
                queryFormat="and"
                showFilter={true}
                filterLabel="Venue filter"
                URLParams={false}
                autosuggest = {false}
                customQuery={
                    function(value) {
                      return {
                        "query":{
                            "bool":{
                                "must":[
                                    {
                                        "bool":{
                                            "must":[
                                                {
                                                    "bool":{
                                                        "should":[
                                                            {
                                                                "multi_match":{
                                                                    "query":value,
                                                                    "fields":["article.content","lawTitle","texte","num",'lawVisa'],
                                                                    "type":"cross_fields",
                                                                    "operator":"and"
                                                                }
                                                            },
                                                            {"multi_match":{
                                                                "query":value,
                                                                "fields":["article.content","lawTitle","texte","num",'lawVisa'],
                                                                "type":"phrase_prefix","operator":"and"}}],
                                                                "minimum_should_match":"1"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ],
                                        "must_not": [
                                            {
                                                "terms": {
                                                "_id": moderatedArticles
                                                }
                                            }
                                        ]
                                    }
                                },
                            "size":5,"_source":{"includes":["*"],"excludes":[]},"from":0}									
                            
                    }
                    }
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
                            and: ['searchbox'],
                        }}
                        renderError={(error) => (
                          <div>
                              Une erreur est survenue : <br/>{error}
                          </div>
                      )}
                      renderResultStats = {
                          function(stats) {
                              return (<div className="resultNumber">Il y a {stats.numberOfResults} résultats</div>);
                          }
                      }
                      renderNoResults={() => (
                          <div className="resultNumber">
                              Aucun résultat trouvé.
                          </div>
                      )
                      }
                        renderItem = {
                            function(item) {
                                    if (item.article){
                                      var re = new RegExp('&gt;', 'g');
                                      var titre = item.sectionTitle.replace(re, ">");
                                      if(titre){
                                      var fullTitle = item.lawTitle + ' - ' + titre;
                                      }
                                      else{
                                          var fullTitle = item.lawTitle;
                                      }
                                      return(<div 
                                          key={item._id}
                                          className='list-item'
                                        >
                                            <h3>{fullTitle}</h3>
                                            <h5>Article numéro : {item.article.num}</h5>
                                            <p>{item.article.content}</p>
                                            <AddArticle titre={fullTitle} texte={item.article.content} number={item.article.num} article_id={item._id} enabled={true} />
                                            <AddArticle titre={fullTitle} texte={item.article.content} number={item.article.num} article_id={item._id} enabled={false}/>
                                          
                                        </div>)
      
                                    }
                                    else if(item.texte){
                                      var re = new RegExp('&gt;', 'g');
                                      if (item.fullSectionsTitre){
                                      var titre = item.fullSectionsTitre.replace(re, ">");
                                      var fullTitle =item.context.titreTxt[0].titre + ' - ' + titre;
                                      }
                                      else{
                                        var fullTitle = item.context.titreTxt[0].titre;
                                      }
      
                                      return(<div 
                                        key={item._id}
                                        className='list-item'
                                      >
                                          <h3>{fullTitle}</h3>
                                          <h5>Article numéro : {item.num}</h5>
                                          <p>{item.texte}</p>
                                          <AddArticle titre={fullTitle} texte={item.texte} number={item.num} article_id={item._id} enabled={true}/>
                                          <AddArticle titre={fullTitle} texte={item.texte} number={item.num} article_id={item._id} enabled={false}/>
                                      </div>)
      
                                    }
                               
                            }
                        }
                    />
        </ReactiveBase>
        </div>
    );
  }