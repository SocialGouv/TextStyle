import Index from '../../components/Articles/IndexArticle'

const ArticlesIndex = props => (
    <Index variable={props.id} />
  );
  
  ArticlesIndex.getInitialProps = async function(context) {
    const {id}  = context.query;

    console.log(`Fetched show: ${id}`);
  
    return { id };
  };
  
  export default ArticlesIndex;