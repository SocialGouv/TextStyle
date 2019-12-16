import React, { useEffect, useState } from "react";
import CkEditor from "./CkEditor";
import PropTypes from "prop-types";
import { Card, Col, Row } from "react-bootstrap";

function listItemEnabled(status) {
  if (status === 0) {
    return "list-item denied";
  } else if (status === 1) {
    return "list-item waiting";
  } else if (status === 2) {
    return "list-item";
  }
}
export default function ListItems(props) {
  const { listRevision } = props;
  const [isFetching, setIsFetching] = useState(false);

  function classList(classes) {
    return Object.entries(classes)
      .filter(entry => entry[1])
      .map(entry => entry[0])
      .join(" ");
  }

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
      {listRevision &&
        listRevision.article.map(listItem => (
          <Card
            key={listItem.id}
            className={classList({
              "card-list": true,
              "item-status": listItemEnabled(listItem.status)
            })}
          >
            <Card.Header className="custom-header">
              {listItem.titre}
            </Card.Header>
            <Card.Body>
              <div className="card-editors">
                <Card.Text className="mb-3">
                  Article numéro : {listItem.number}
                </Card.Text>
                <Row className=" mt-5">
                  <Col sm={12} md={6}>
                    <CkEditor readonly={true} article={listItem} />
                  </Col>
                  <Col sm={12} md={6}>
                    <CkEditor readonly={false} article={listItem} />
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        ))}
    </div>
  );
}

ListItems.propTypes = {
  listRevision: PropTypes.object,
  onLoadMore: PropTypes.func
};
