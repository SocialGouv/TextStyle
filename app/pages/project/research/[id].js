import ElasticResearch from '../../../components/Research/ElasticResearch'
import Link from 'next/link'


const ArticlesIndex = props => (
  <div>
    <header className="text-right">
      <Link href={'/project/' + props.id} >
        <a className="btn btn-primary">Voir les articles modérés</a>
      </Link>
    </header>
    <ElasticResearch projet={props.id} />
  </div>
);

ArticlesIndex.getInitialProps = async function (context) {
  const { id } = context.query;

  return { id };
};

export default ArticlesIndex;