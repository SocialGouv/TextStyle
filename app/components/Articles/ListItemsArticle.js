import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { FaTrashAlt,FaCheck, FaBan } from 'react-icons/fa'
import Router from 'next/router'


import deleteListItemsFromCache from '../../utils/deleteListItemsFromCache'
import { LIST_ITEMS_CONNECTION_QUERY } from './PaginationArticle'

const DELETE_LIST_ITEM_MUTATION = gql`
  mutation DELETE_LIST_ITEM_MUTATION($id: Int) {
    delete_article(where: {id: {_eq: $id}}) {
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

const EDIT_LIST_ITEM = gql`
  mutation CREATE_LIST_ITEM($id: Int!,$enabled : Boolean) {
    update_article(where: {id: {_eq: $id}}, _set: {enabled: $enabled}) {
      affected_rows
      returning {
        article_id
        enabled
        id
        texte
        number
        titre
      }
    }
  }
`

class ListItems extends Component {

  onUpdate = cache => {
    // Call our helper function to delete item from cache
    deleteListItemsFromCache(cache)

    // Deleting the item in this way doesn't trigger a re
    // render of our Index.js component so we have to call
    // refetch which is given to us by our Query component
    // and passed down from Index.js via props
    this.props.refetch()
  }
  
  render() {
    const { listItems } = this.props

    return (
      <div>
        {listItems && listItems.map((listItem) => (
          <div 
            key={listItem.id}
            className={listItem.enabled ? 'list-item': 'list-item denied'}
          >
            {/* {listItem.titre.length > 100 
              ? listItem.titre.substring(0,70) + '...'
              : listItem.titre} */}
              <h3>{listItem.titre}</h3>
              <h5>Article numéro : {listItem.number}</h5>
              <p>{listItem.texte}</p>
              <Mutation 
                mutation={EDIT_LIST_ITEM} 
                variables={{ id: listItem.id, enabled: !listItem.enabled  }}
                // Refetch pagination data on creating an item to update item 
                // & page counts. The Query is being imported from ./Pagination
                refetchQueries={[{ query: LIST_ITEMS_CONNECTION_QUERY }]}
                // Call our helper function on update (it will be passed the chache)
                update={deleteListItemsFromCache}
                onCompleted={() => Router.push(Router.router.asPath) }
              >
              {(editListItem, {error, loading}) => {
                if(error) console.log(error)

                return (
                  <button 
                    onClick={() => confirm(listItem.enabled ? "Êtes vous sur de vouloir refuser l\'article ?" : "Êtes vous sur de vouloir accepter l\'article ?" ) && editListItem()}
                    className={listItem.enabled ? "deleteButton" : "deleteButton createButton" }  
                    disabled={loading}
                  >
                    {listItem.enabled ? <FaBan /> : <FaCheck/> }
                  </button>
                )
              }}
            </Mutation>
            <Mutation 
              mutation={DELETE_LIST_ITEM_MUTATION} 
              variables={{ id: listItem.id }}
              update={this.onUpdate}
              // Don't forget to refetch the pagination data!
              refetchQueries={[ { query: LIST_ITEMS_CONNECTION_QUERY } ]}
              >
              {(deleteListItem, {error, loading}) => {
                if(error) console.log(error)

                return (
                  <button 
                    onClick={() => confirm('Êtes vous sur de vouloir supprimer cette article ?') && deleteListItem()}
                    className="delete"  
                    disabled={loading}
                  >
                    <FaTrashAlt />
                  </button>
                )
              }}
            </Mutation>
          </div>
        ))}
      </div>
    )
  }
}

export default ListItems