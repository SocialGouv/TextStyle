import React, { useEffect, useState } from "react";
import EditArticle from "./EditArticle";
import { Card, Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";

function getStatus(status, numberArticle) {
  let statusString;
  if (status === "validated") {
    statusString = numberArticle > 1 ? "validés" : "validé";
  } else if (status === "waiting") {
    statusString = numberArticle > 1 ? "en attente" : "en attente";
  } else if (status === "declined") {
    statusString = numberArticle > 1 ? "refusés" : "refusé";
  }

  return statusString;
}

function classList(classes) {
  return Object.entries(classes)
    .filter(entry => entry[1])
    .map(entry => entry[0])
    .join(" ");
}

function ListItems(props) {
  const { listItems, numberArticle, status } = props;

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        isFetching
      ) {
        return;
      }
      setIsFetching(true);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching]);

  useEffect(() => {
    const { onLoadMore } = props;
    if (!isFetching) return;
    onLoadMore();
    setIsFetching(false);
  }, [isFetching, props]);

  return (
    <div>
      <p className="numberArticle">
        Il y a {numberArticle} article{numberArticle > 1 ? "s" : ""}{" "}
        {getStatus(status, numberArticle)}
      </p>
      {listItems &&
        listItems.map(listItem => (
          <Card
            key={listItem.id}
            className={classList({
              "card-list": true
            })}
          >
            <Card.Header className="custom-header">
              {listItem.titre}
            </Card.Header>
            <Card.Body>
              <Col xs={12} md={10}>
                <Row>
                  <Card.Text className="mb-3">
                    Article numéro : {listItem.number}
                  </Card.Text>
                </Row>
                <Row>
                  <Card.Title>{listItem.texte}</Card.Title>
                </Row>
              </Col>
              <Col xs={12} md={2}>
                <div className="card-actions">
                  <EditArticle status={listItem.status} id={listItem.id} />
                </div>
              </Col>
            </Card.Body>
          </Card>
        ))}
    </div>
  );
}

ListItems.propTypes = {
  listItems: PropTypes.array,
  numberArticle: PropTypes.number,
  status: PropTypes.string,
  onLoadMore: PropTypes.func
};

export default ListItems;
