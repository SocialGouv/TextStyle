import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Link from 'next/link'
import { FaPlusSquare } from 'react-icons/fa'
import { withRouter } from 'next/router'

import { PER_PAGE as perPage  } from '../../config/config'
import Pagination from './PaginationArticle'
import ListItems from './ListItemsArticle'

const GET_LIST_ITEMS_QUERY = gql`
  query GET_LIST_ITEMS_QUERY($skip: Int, $first: Int) {
    article(offset: $skip, limit: $first, order_by: {enabled: desc}) {
      id
      titre
      enabled
      article_id
      texte
      number
    }
  }
`

class Index extends Component {  
  render() {
    return (
      <Query 
        query={GET_LIST_ITEMS_QUERY} 
        variables={{
          skip: ((this.props.router.query.page || 1) - 1) * perPage,
          first: perPage
        }}

        // adding this so we can get the correct loading status on refetch
        notifyOnNetworkStatusChange
      >
        { // Pull refetch from our Query and pass it down to ListItems.js  
        ({data, error, loading, refetch, networkStatus}) => {
          if(error) return console.log(error) || <div/>
          //const article = data.article;

          return (
            <div>
              <header>
                <h2>Liste des articles</h2>

                {/* <Link href='/createArticle' >
                  <a className="add-link"><FaPlusSquare /></a>
                </Link> */}
              </header>
              
              { // if networkStatus is 4 then we're refetching so 
                // show loading state
              (loading || networkStatus === 4)
                ? <div className="loading-items"><p>Loading...</p></div> 
                : <ListItems listItems={data.article} refetch={refetch} />}
              
              <Pagination />
            </div>
          )
        }}
      </Query>
    )
  }
}

export default withRouter(Index)