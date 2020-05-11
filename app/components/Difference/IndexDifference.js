import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Row } from "react-bootstrap";
import { getJwt } from "../../utils/auth";

import { useQuery } from "@apollo/react-hooks";
import { GET_LIST_REVISION_ARTICLES_QUERY } from "../Revisions/queries";
import CalculationDiff from "./CalculationDiff";
import CkEditor from "../Revisions/CkEditor";

export default function ListItemsDiff(props) {
  const { project } = props;

  const {
    loading: loadingArticles,
    error: errorArticles,
    networkStatus: networkStatus,
    data: data
  } = useQuery(GET_LIST_REVISION_ARTICLES_QUERY, {
    variables: {
      skip: 0,
      first: 2,
      project: project
    },
    fetchPolicy: "network-only"
  });
  if (loadingArticles && networkStatus !== 3) return <p>Loading...</p>;
  if (errorArticles) return <p>Error: {errorArticles.message}</p>;
  const userInfo = getJwt();

  if (userInfo === undefined) return <p>Loading...</p>;

  return (
    <Row>
      <Col className="p-0" sm={12} md={12}>
        {data &&
          data.article.map(listItem => (
            <div key={listItem.id}>
              {listItem.article_revisions[0] && (
                <Card className="card-list">
                  <Card.Body>
                    <div className="card-editors">
                      <Card.Text id="articleId" className="">
                        {listItem.number}
                      </Card.Text>
                      <Row className="my-5">
                        <Col sm={12} md={4}>
                          <CkEditor
                            readonly={true}
                            isDifference={false}
                            isRevision={false}
                            article={listItem}
                          />
                        </Col>
                        <Col sm={12} md={4}>
                          <CkEditor
                            readonly={true}
                            isDifference={true}
                            isRevision={false}
                            article={listItem}
                          />
                        </Col>
                        <Col sm={12} md={4}>
                          <Row>
                            <CalculationDiff
                              articleId={listItem.number}
                              firstText={listItem.texte}
                              secondText={
                                listItem.article_revisions[
                                  listItem.article_revisions.length - 1
                                ].textFormatted
                              }
                            />
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </div>
          ))}
      </Col>
    </Row>
  );
}

ListItemsDiff.propTypes = {
  project: PropTypes.string,
  onLoadMore: PropTypes.func
};
