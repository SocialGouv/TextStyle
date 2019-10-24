import React, { Component } from 'react';
import {
	ReactiveBase,
	CategorySearch,
	SingleRange,
	ResultCard,
	ReactiveList,
} from '@appbaseio/reactivesearch'; 
import App from '../components/App'
import Header from '../components/Header'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import AddArticle from '../components/AddArticle'
import { useQuery } from '@apollo/react-hooks';
import { Mutation } from 'react-apollo';
import { LIST_ITEMS_CONNECTION_QUERY } from '../components/Articles/PaginationArticle';
import deleteListItemsFromCache from '../utils/deleteListItemsFromCache';
import { FaCheck, FaBan } from 'react-icons/fa';



const CREATE_LIST_ITEM = gql`
  mutation CREATE_LIST_ITEM($title: String!,$texte : String, $number: String,$article_id: String,$enabled: Boolean) {
    insert_article(objects: {titre: $title,enabled: $enabled, article_id: $article_id,texte: $texte,number: $number}) {
      returning {
        id
        titre
        enabled
        article_id
        texte
        number
      }
    }
  }
`


const GET_ARTICLE = gql`
  query getArticle($skip: Int!) {
    article(offset: $skip, limit: 5) {
      id
      article_id
    }
}
`;

function ArticleList() {
    const { loading, error, data } = useQuery(GET_ARTICLE, {
      variables: { skip: 0 },
    });
    return data;
}

const Index = props => (
    <App>
        <Header/>
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
              function(value, proprs) {
                  //var test = ArticleList();
                  //console.log(test);
                  //console.log(props)
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
                          // if(item._id === "LEGIARTI000033045608"){
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
                                    <Mutation 
                                        mutation={CREATE_LIST_ITEM} 
                                        variables={{ title: fullTitle,texte : item.article.content, number:item.article.num,article_id: item._id,enabled: 'true'  }}
                                        // Refetch pagination data on creating an item to update item 
                                        // & page counts. The Query is being imported from ./Pagination
                                        refetchQueries={[{ query: LIST_ITEMS_CONNECTION_QUERY }]}
                                        // Call our helper function on update (it will be passed the chache)
                                        update={deleteListItemsFromCache}
                                      >
                                      {(createListItem, {error, loading}) => {
                                        if(error) console.log(error)
                        
                                        return (
                                          <button 
                                            onClick={() => confirm('Êtes vous sur de vouloir accepter l\'article ?') && createListItem()}
                                            className="createButton"  
                                            disabled={loading}
                                          >
                                            <FaCheck />
                                          </button>
                                        )
                                      }}
                                    </Mutation>
                                    <Mutation 
                                        mutation={CREATE_LIST_ITEM} 
                                        variables={{ title: fullTitle,texte : item.article.content, number:item.article.num,article_id: item._id,enabled: 'false'  }}
                                        // Refetch pagination data on creating an item to update item 
                                        // & page counts. The Query is being imported from ./Pagination
                                        refetchQueries={[{ query: LIST_ITEMS_CONNECTION_QUERY }]}
                                        // Call our helper function on update (it will be passed the chache)
                                        update={deleteListItemsFromCache}
                                      >
                                      {(createListItem, {error, loading}) => {
                                        if(error) console.log(error)
                        
                                        return (
                                          <button 
                                            onClick={() => confirm('Êtes vous sur de vouloir refuser l\'article ?') && createListItem()}
                                            className="deleteButton"  
                                            disabled={loading}
                                          >
                                            <FaBan />
                                          </button>
                                        )
                                      }}
                                    </Mutation>
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
                                  <Mutation 
                                      mutation={CREATE_LIST_ITEM} 
                                      variables={{ title: fullTitle,texte : item.texte, number:item.num,article_id: item._id,enabled: 'true'  }}
                                      // Refetch pagination data on creating an item to update item 
                                      // & page counts. The Query is being imported from ./Pagination
                                      refetchQueries={[{ query: LIST_ITEMS_CONNECTION_QUERY }]}
                                      // Call our helper function on update (it will be passed the chache)
                                      update={deleteListItemsFromCache}
                                    >
                                    {(createListItem, {error, loading}) => {
                                      if(error) console.log(error)
                      
                                      return (
                                        <button 
                                          onClick={() => confirm('Êtes vous sur de vouloir accepter l\'article ?') && createListItem()}
                                          className="createButton"  
                                          disabled={loading}
                                        >
                                          <FaCheck />
                                        </button>
                                      )
                                    }}
                                  </Mutation>
                                  <Mutation 
                                      mutation={CREATE_LIST_ITEM} 
                                      variables={{ title: fullTitle,texte : item.texte, number:item.num,article_id: item._id,enabled: 'false'  }}
                                      // Refetch pagination data on creating an item to update item 
                                      // & page counts. The Query is being imported from ./Pagination
                                      refetchQueries={[{ query: LIST_ITEMS_CONNECTION_QUERY }]}
                                      // Call our helper function on update (it will be passed the chache)
                                      update={deleteListItemsFromCache}
                                    >
                                    {(createListItem, {error, loading}) => {
                                      if(error) console.log(error)
                      
                                      return (
                                        <button 
                                          onClick={() => confirm('Êtes vous sur de vouloir refuser l\'article ?') && createListItem()}
                                          className="deleteButton"  
                                          disabled={loading}
                                        >
                                          <FaBan />
                                        </button>
                                      )
                                    }}
                                  </Mutation>
                                </div>)

                              }
                         
                      }
                  }
                  // }
                  
              />
  </ReactiveBase>
  </App>
)

// Index.getInitialProps = async function() {
//     const { loading, error, datas } = await useQuery(GET_ARTICLE, {
//         variables: { skip: 0 },
//       });
//       console.log(datas);
//       const data = await datas.json();
//       console.log(data);
//       return {
//         articlesTreat: data.map(entry => entry.article)
//       };
//   };


export default Index
