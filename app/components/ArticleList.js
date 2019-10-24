import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import EditArticle from '../components/EditArticle'


const GET_ARTICLE = gql`
  query getArticle($skip: Int!,$enabled : Boolean) {
    article(offset: $skip, limit: 2, where: {enabled: {_eq: $enabled}}) {
      id
      article_id
      enabled
      number
      texte
      titre
    }
    article_aggregate(where: {enabled: {_eq: $enabled}}) {
      aggregate {
        count
      }
    }  
}
`;

export default function ArticleList(variables) {
  const { loading, error, data, fetchMore } = useQuery(GET_ARTICLE, {
    variables: { skip: 0, enabled: variables.enabled },
    refetchQueries: [GET_ARTICLE]
  });
  if (loading) return <p>Loading ...</p>;
  console.log(data);
  const areMoreArticle = data.article.length < data.article_aggregate.aggregate.count
  console.log(areMoreArticle)
  return (<div>
               {data.article.map((item, index) => (
                 <div key={item.id} className="card p-3 m-5">
                 <div className="card-body">
                   <h5 className="card-title">{item.titre}</h5>
                   <h6 className="card-subtitle mb-2 text-muted">{item.number ? "Article numéro : " : ""}{item.number}</h6>
                   <p className="card-text">{item.texte}</p>
                   <EditArticle classButton={item.enabled ? "btn btn-danger" : "btn btn-success"} button={item.enabled ? "Refuser article " : "Ajouter article"} id={item.id} enabled={!item.enabled} />
                 </div>
               </div>
                ))}
              {areMoreArticle ? (
                <button onClick={() => loadMoreArticles(data.article, fetchMore)}>
                  {''}
                  {loading ? 'Loading...' : 'Show More'}{' '}
                </button>
              ) : (
                ''
  )}</div>);
}

// export const authorQueryVars = {
//   skip: 0,
// }

// export default function AuthorList () {
//   return (
//     <Query query={authorQuery} variables={authorQueryVars}>
//       {({ loading, error, data: { author, author_aggregate }, fetchMore }) => {
//         if (error) return <ErrorMessage message='Error loading authors.' />
//         if (loading) return <div>Loading</div>

//         const areMoreAuthors = author.length < author_aggregate.aggregate.count
//         return (
//           <section>
//             <ul>
//               {author.map((a, index) => (
//                 <li key={a.id}>
//                   <div>
//                     <span>{index + 1}. </span>
//                     <a>{a.name}</a>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//             {areMoreAuthors ? (
//               <button onClick={() => loadMoreAuthors(author, fetchMore)}>
//                 {' '}
//                 {loading ? 'Loading...' : 'Show More'}{' '}
//               </button>
//             ) : (
//               ''
//             )}
//             <style jsx>{`
//               section {
//                 padding-bottom: 20px;
//               }
//               li {
//                 display: block;
//                 margin-bottom: 10px;
//               }
//               div {
//                 align-items: center;
//                 display: flex;
//               }
//               a {
//                 font-size: 14px;
//                 margin-right: 10px;
//                 text-decoration: none;
//                 padding-bottom: 0;
//                 border: 0;
//               }
//               span {
//                 font-size: 14px;
//                 margin-right: 5px;
//               }
//               ul {
//                 margin: 0;
//                 padding: 0;
//               }
//               button:before {
//                 align-self: center;
//                 border-style: solid;
//                 border-width: 6px 4px 0 4px;
//                 border-color: #ffffff transparent transparent transparent;
//                 content: '';
//                 height: 0;
//                 margin-right: 5px;
//                 width: 0;
//               }
//             `}</style>
//           </section>
//         )
//       }}
//     </Query>
//   )
// }

function loadMoreArticles (article, fetchMore) {
  console.log(article.length)
  fetchMore({
    variables: {
      skip: article.length
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      console.log(fetchMoreResult);
      console.log(previousResult);
      if (!fetchMoreResult) {
        return previousResult
      }
      
      return Object.assign({}, previousResult, {
        // Append the new results to the old one
        article: [...previousResult.article, ...fetchMoreResult.article]
      })
    }
  })
}
