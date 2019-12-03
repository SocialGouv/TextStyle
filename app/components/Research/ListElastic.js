import AddArticle from "./AddArticle";
import React from "react";

export default function ListElastic(props) {
  const { item, project } = props;
  var re, titre, fullTitle;
  if (item.article) {
    re = new RegExp("&gt;", "g");
    titre = item.sectionTitle.replace(re, ">");
    if (titre) {
      fullTitle = item.lawTitle + " - " + titre;
    } else {
      fullTitle = item.lawTitle;
    }
    return (
      <div key={item._id} className="list-item">
        <h3>{fullTitle}</h3>
        <h5>
          Article numéro : {item.article.num ? item.article.num : "annexe"}
        </h5>
        <p>{item.article.content}</p>
        <AddArticle
          titre={fullTitle}
          texte={item.article.content}
          number={item.article.num ? item.article.num : "annexe"}
          article_id={item._id}
          status={2}
          project={project}
          handleUpdateModeratedArticles={props.handleUpdateModeratedArticles}
        />
        <AddArticle
          titre={fullTitle}
          texte={item.article.content}
          number={item.article.num ? item.article.num : "annexe"}
          article_id={item._id}
          status={0}
          project={project}
          handleUpdateModeratedArticles={props.handleUpdateModeratedArticles}
        />
        <AddArticle
          titre={fullTitle}
          texte={item.article.content}
          number={item.article.num ? item.article.num : "annexe"}
          article_id={item._id}
          status={1}
          project={project}
          handleUpdateModeratedArticles={props.handleUpdateModeratedArticles}
        />
      </div>
    );
  } else if (item.texte) {
    re = new RegExp("&gt;", "g");
    if (item.fullSectionsTitre) {
      titre = item.fullSectionsTitre.replace(re, ">");
      fullTitle = item.context.titreTxt[0].titre + " - " + titre;
    } else {
      fullTitle = item.context.titreTxt[0].titre;
    }

    return (
      <div key={item._id} className="list-item">
        <h3>{fullTitle}</h3>
        <h5>Article numéro : {item.num ? item.num : "annexe"}</h5>
        <p>{item.texte}</p>
        <AddArticle
          titre={fullTitle}
          texte={item.texte}
          number={item.num ? item.num : "annexe"}
          article_id={item._id}
          status={2}
          project={project}
          handleUpdateModeratedArticles={props.handleUpdateModeratedArticles}
        />
        <AddArticle
          titre={fullTitle}
          texte={item.texte}
          number={item.num ? item.num : "annexe"}
          article_id={item._id}
          status={0}
          project={project}
          handleUpdateModeratedArticles={props.handleUpdateModeratedArticles}
        />
        <AddArticle
          titre={fullTitle}
          texte={item.texte}
          number={item.num ? item.num : "annexe"}
          article_id={item._id}
          status={1}
          project={project}
          handleUpdateModeratedArticles={props.handleUpdateModeratedArticles}
        />
      </div>
    );
  }
}
