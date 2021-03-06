import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import AddArticle from "./AddArticle";
import PropTypes from "prop-types";

function FullArticle(props) {
  const { project, reduceArticle, moderatedArticles } = props;
  const [article, setArticle] = useState({});
  var data = {
    articleId: reduceArticle.id
  };
  var body = JSON.stringify(data);
  var classArticle = "w-100 m-0 text-article";
  let isModerated = 0;
  if (moderatedArticles.indexOf(reduceArticle.id) > -1) {
    classArticle = "w-100 m-0 text-article articleReviewed";
    isModerated = 1;
  }
  useEffect(() => {
    if (reduceArticle.id) {
      fetch("http://127.0.0.1:3000/api/article", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: body
      })
        .then(response => response.json())
        .then(jsonResponse => {
          if (jsonResponse && jsonResponse.article) {
            let dateVigueur = new Date(jsonResponse.article.dateDebut);
            dateVigueur = dateVigueur.toLocaleString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric"
            });
            console.log(jsonResponse.article);

            setArticle({
              id: jsonResponse.article.id,
              num: jsonResponse.article.num,
              texteHtml: jsonResponse.article.texteHtml.replace(
                /(<a[^>]*>|<\/a>)/g,
                ""
              ),
              fullTitre: jsonResponse.article.fullSectionsTitre.replace(
                /&gt;|&lgt;/g,
                "/"
              ),
              date: dateVigueur
            });
          }
        })
        .catch(error => console.log(error));
    }
  }, [body, reduceArticle.id]);
  if (reduceArticle.id) {
    return (
      <Row className={classArticle} key={article.id}>
        <Col xs={12} md={11}>
          <Card className="card-list">
            <Card.Body>
              <Col>
                <Row>
                  <Card.Title className="mb-3">
                    <p className="articleFullTitre">{article.fullTitre}</p>
                    <h5>
                      Article {article.num}{" "}
                      <span>En vigueur depuis le {article.date}</span>
                    </h5>
                  </Card.Title>
                </Row>
                <Row>
                  <Card.Text
                    dangerouslySetInnerHTML={{ __html: article.texteHtml }}
                  ></Card.Text>
                </Row>
              </Col>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={1} className="m-auto text-center">
          {!isModerated ? (
            <div className="card-actions">
              <AddArticle
                titre={article.num}
                texte={article.texteHtml}
                number={article.num}
                article_id={article.id}
                status={2}
                project={project}
                handleUpdateModeratedArticles={
                  props.handleUpdateModeratedArticles
                }
              />
              <AddArticle
                titre={article.num}
                texte={article.texteHtml}
                number={article.num}
                article_id={article.id}
                status={0}
                project={project}
                handleUpdateModeratedArticles={
                  props.handleUpdateModeratedArticles
                }
              />
              <AddArticle
                titre={article.num}
                texte={article.texteHtml}
                number={article.num}
                article_id={article.id}
                status={1}
                project={project}
                handleUpdateModeratedArticles={
                  props.handleUpdateModeratedArticles
                }
              />
            </div>
          ) : (
            ""
          )}
        </Col>
      </Row>
    );
  }
  return "";
}

export default FullArticle;

FullArticle.propTypes = {
  reduceArticle: PropTypes.object,
  project: PropTypes.string,
  moderatedArticles: PropTypes.array,
  handleUpdateModeratedArticles: PropTypes.func
};
