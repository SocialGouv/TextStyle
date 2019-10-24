import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'

import deleteListItemsFromCache from '../../utils/deleteListItemsFromCache'
import { LIST_ITEMS_CONNECTION_QUERY } from './PaginationArticle'

const CREATE_LIST_ITEM = gql`
  mutation CREATE_LIST_ITEM($title: String!) {
    insert_article(objects: {titre: $title}) {
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

class Create extends Component {
  state = {
    titre: ''
  }

  render() {
    return (
      <div>
        <header>
          <h2>Create List Item</h2>
          <p>Create a new Item</p>
        </header>

          <div className='list-item list-item--form'>
          <Mutation 
            mutation={CREATE_LIST_ITEM} 
            variables={{ title: this.state.titre }}
            // Refetch pagination data on creating an item to update item 
            // & page counts. The Query is being imported from ./Pagination
            refetchQueries={[{ query: LIST_ITEMS_CONNECTION_QUERY }]}
            // Call our helper function on update (it will be passed the chache)
            update={deleteListItemsFromCache}
            onCompleted={() => Router.push('/') }
          >
            {(createListItem, {error, loading}) => {
              if(loading) return <p>Loading...</p>
              if(error) return alert(error)

              return (
                <>
                <label htmlFor="title">
                  Title: 
                  <input 
                    id="title" 
                    name="title"
                    onChange={e => this.setState({ titre: e.target.value })}
                  />
                </label>

                <button onClick={createListItem}>Create Item</button>
                </>
              )
            }}
          </Mutation>
          </div>
      </div>
    )
  }
}

export default Create