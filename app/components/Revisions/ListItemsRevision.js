import React, { useEffect, useState } from "react";
import CkEditor from "./CkEditor";
import PropTypes from "prop-types";
import { Card, Col, Row } from "react-bootstrap";
import ModalComment from "./ModalComment";
import { getJwt } from "../../utils/auth";

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
  const { listRevision, userList } = props;
  const [isFetching, setIsFetching] = useState(false);
  const [modalShow, setSidebarOpen] = useState(false);
  const [currentArticleInfo, setCurrentArticleInfo] = useState({});
  const userInfo = getJwt();

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

  if (userInfo === undefined) return <p>Loading...</p>;

  function classList(classes) {
    return Object.entries(classes)
      .filter(entry => entry[1])
      .map(entry => entry[0])
      .join(" ");
  }

  function openModal(id, user) {
    console.log(id);
    setSidebarOpen(true);

    setCurrentArticleInfo({ article: id, user: user });
  }

  return (
    <Row>
      <Col className="p-0" sm={12} md={modalShow ? 9 : 12}>
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
                    <Col sm={12} md={5}>
                      <CkEditor readonly={true} article={listItem} />
                    </Col>
                    <Col sm={12} md={5}>
                      <CkEditor readonly={false} article={listItem} />
                    </Col>
                    <Col sm={12} md={2}>
                      {userList &&
                        userList.project[0].project_writers.map(user => (
                          <button
                            key={user.user.id}
                            onClick={() => openModal(listItem.id, user.user)}
                          >
                            {user.user.firstName}
                          </button>
                        ))}
                      {userList &&
                        userList.project[0].project_administrators.map(user => (
                          <button
                            onClick={() =>
                              openModal(listItem.id, user.administrator)
                            }
                            key={user.administrator.id}
                          >
                            {user.administrator.firstName}
                          </button>
                        ))}
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          ))}
      </Col>
      {modalShow && (
        <Col className="p-0" sm={12} md={3}>
          <ModalComment
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="add-member-modal"
            show={modalShow}
            user={currentArticleInfo.user}
            article={currentArticleInfo.article}
            onHide={id => setSidebarOpen(id)}
          />
        </Col>
      )}
    </Row>
  );
}

ListItems.propTypes = {
  listRevision: PropTypes.object,
  userList: PropTypes.object,
  onLoadMore: PropTypes.func
};
