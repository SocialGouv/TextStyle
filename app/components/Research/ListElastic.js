import AddArticle from "./AddArticle";
import React from "react";
import { Card, Row, Col } from "react-bootstrap";

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
      <Card key={item._id} className="card-list">
        <Card.Header className="custom-header">{fullTitle}</Card.Header>
        <Card.Body>
          <Col xs={12} md={10}>
            <Row>
              <Card.Text className="mb-3">
                Article numéro :{" "}
                {item.article.num ? item.article.num : "annexe"}
              </Card.Text>
            </Row>
            <Row>
              <Card.Title>{item.article.content}</Card.Title>
            </Row>
          </Col>
          <Col xs={12} md={2}>
            <div className="card-actions">
              <AddArticle
                titre={fullTitle}
                texte={item.article.content}
                number={item.article.num ? item.article.num : "annexe"}
                article_id={item._id}
                status={2}
                project={project}
                handleUpdateModeratedArticles={
                  props.handleUpdateModeratedArticles
                }
              />
              <AddArticle
                titre={fullTitle}
                texte={item.article.content}
                number={item.article.num ? item.article.num : "annexe"}
                article_id={item._id}
                status={0}
                project={project}
                handleUpdateModeratedArticles={
                  props.handleUpdateModeratedArticles
                }
              />
              <AddArticle
                titre={fullTitle}
                texte={item.article.content}
                number={item.article.num ? item.article.num : "annexe"}
                article_id={item._id}
                status={1}
                project={project}
                handleUpdateModeratedArticles={
                  props.handleUpdateModeratedArticles
                }
              />
            </div>
          </Col>
        </Card.Body>
      </Card>
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
      <Card key={item._id} className="card-list">
        <Card.Header className="custom-header">{fullTitle}</Card.Header>
        <Card.Body>
          <Col xs={12} md={10}>
            <Row>
              <Card.Text className="mb-3">
                Article numéro : {item.num ? item.num : "annexe"}
              </Card.Text>
            </Row>
            <Row>
              <Card.Title>{item.texte}</Card.Title>
            </Row>
          </Col>
          <Col xs={12} md={2}>
            <div className="card-actions">
              <AddArticle
                titre={fullTitle}
                texte={item.texte}
                number={item.num ? item.num : "annexe"}
                article_id={item._id}
                status={2}
                project={project}
                handleUpdateModeratedArticles={
                  props.handleUpdateModeratedArticles
                }
              />
              <AddArticle
                titre={fullTitle}
                texte={item.texte}
                number={item.num ? item.num : "annexe"}
                article_id={item._id}
                status={1}
                project={project}
                handleUpdateModeratedArticles={
                  props.handleUpdateModeratedArticles
                }
              />
              <AddArticle
                titre={fullTitle}
                texte={item.texte}
                number={item.num ? item.num : "annexe"}
                article_id={item._id}
                status={0}
                project={project}
                handleUpdateModeratedArticles={
                  props.handleUpdateModeratedArticles
                }
              />
            </div>
          </Col>
        </Card.Body>
      </Card>
    );
  }
}
