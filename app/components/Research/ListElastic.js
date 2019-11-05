import AddArticle from './AddArticle'

export default function ListElastic(props) {
    const { item, project } = props;
    if (item.article) {
        var re = new RegExp('&gt;', 'g');
        var titre = item.sectionTitle.replace(re, ">");
        if (titre) {
            var fullTitle = item.lawTitle + ' - ' + titre;
        }
        else {
            var fullTitle = item.lawTitle;
        }
        return (<div
            key={item._id}
            className='list-item'
        >
            <h3>{fullTitle}</h3>
            <h5>Article numéro : {item.article.num}</h5>
            <p>{item.article.content}</p>
            <AddArticle titre={fullTitle} texte={item.article.content} number={item.article.num} article_id={item._id} enabled={true} project={project} />
            <AddArticle titre={fullTitle} texte={item.article.content} number={item.article.num} article_id={item._id} enabled={false} project={project} />

        </div>)

    }
    else if (item.texte) {
        var re = new RegExp('&gt;', 'g');
        if (item.fullSectionsTitre) {
            var titre = item.fullSectionsTitre.replace(re, ">");
            var fullTitle = item.context.titreTxt[0].titre + ' - ' + titre;
        }
        else {
            var fullTitle = item.context.titreTxt[0].titre;
        }

        return (<div
            key={item._id}
            className='list-item'
        >
            <h3>{fullTitle}</h3>
            <h5>Article numéro : {item.num}</h5>
            <p>{item.texte}</p>
            <AddArticle titre={fullTitle} texte={item.texte} number={item.num} article_id={item._id} enabled={true} project={project} />
            <AddArticle titre={fullTitle} texte={item.texte} number={item.num} article_id={item._id} enabled={false} project={project} />
        </div>)

    }
}