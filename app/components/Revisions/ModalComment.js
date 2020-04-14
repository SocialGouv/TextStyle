import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import { useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import { getJwt } from "../../utils/auth";
import { GET_LIST_COMMENT_ARTICLE_QUERY } from "./queries";
import { Col, Row } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import AddComment from "./AddComment";
import ItemComment from "./ItemComment";

export default function ModalComment(props) {
  const { show, onHide } = props;
  const userInfo = getJwt();
  const [canModify, setCanModify] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState("");
  const [currentComment, setCurrentComment] = useState("");

  const node = useRef();

  useEffect(() => {
    const handleClickOutside = e => {
      if (node.current.contains(e.target)) {
        // inside click
        return;
      }
      // outside click
      setIsAnswering(false);
      var lastComment = document.getElementById(currentCommentId);
      if (lastComment) {
        lastComment.style.display = "block";
      }
    };

    if (isAnswering) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentCommentId, isAnswering]);

  const getDate = value => {
    var today = new Date(value);
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + "/" + mm + "/" + yyyy;
    return today;
  };
  const getTime = value => {
    return value.slice(11, 19);
  };
  const { loading: loadingConfig, error: errorConfig, data: data } = useQuery(
    GET_LIST_COMMENT_ARTICLE_QUERY,
    {
      variables: {
        user: props.user ? props.user.id : 0,
        article: props.article
      },
      fetchPolicy: "network-only"
    }
  );
  if (loadingConfig) return <p>Loading...</p>;
  if (errorConfig) {
    return <p>Error: {errorConfig.message}</p>;
  }
  const close = () => {
    onHide();
    setIsAnswering(false);
  };
  const replyComment = (e, id) => {
    var lastComment = document.getElementById(currentCommentId);
    if (lastComment) {
      lastComment.style.display = "block";
    }
    var selected = document.getElementById(id);
    selected.style.display = "none";
    setCurrentCommentId(id);
    setCanModify(false);
    setIsAnswering(true);
  };
  if (userInfo === undefined) return <p>Loading...</p>;
  return (
    <Container ref={node} className="comment-list">
      {show && (
        <div>
          <div className="d-flex justify-content-between mb-3">
            <h3> Fil de discussion</h3>
            <Button className="btn-close-comment" onClick={close}>
              <Image src="/icon/Croix.svg" />
            </Button>
          </div>
          <Container className="pl-0">
            {data.article_comment[0] && isAnswering && (
              <AddComment
                reply={currentCommentId}
                comment={null}
                article={data.article_comment[0].article_id}
                user={userInfo.user.id}
                onHideForm={() => setIsAnswering(false)}
                type="add"
              />
            )}
          </Container>
        </div>
      )}
      {show &&
        !data.article_comment[0] &&
        props.user &&
        userInfo.user.id === props.user.id && (
          <Container className="pl-0">
            <AddComment
              reply={null}
              comment={null}
              article={props.article}
              user={userInfo.user.id}
              onHideForm={() => setIsAnswering(false)}
              type="add"
            />
          </Container>
        )}

      {data.article_comment[0] && (
        <Container className="comment-list-container">
          {show && (
            <div>
              {data.article_comment[0] && !canModify && props.user && (
                <div className="bg-white shadow py-3">
                  <Row>
                    {userInfo.user.id === props.user.id && (
                      <Col xs={12}>
                        <Row className="d-flex justify-content-end mx-3">
                          <p>Vous</p>
                          <Image
                            onClick={() => {
                              setCanModify(true);
                              setCurrentComment(data.article_comment[0]);
                            }}
                            className="img-update ml-3"
                            width="20"
                            height="20"
                            src="/icon/Couronne.svg"
                          />

                          <Image
                            className="ml-3 user-comment"
                            width="20"
                            height="20"
                            src="/icon/Profil-femme-1.svg"
                          />
                        </Row>
                        <Row className="d-flex justify-content-end mx-3">
                          <div
                            className={
                              !data.article_comment[0].responses[0]
                                ? "comment-sender shadow"
                                : "comment-sender shadow hasChild"
                            }
                          >
                            <p> {data.article_comment[0].comment}</p>
                          </div>
                        </Row>
                        <Row className="comment-footer d-flex justify-content-end mx-3 mt-3">
                          {data.article_comment[0] && props.user && (
                            <Image
                              id={data.article_comment[0].id}
                              onClick={e => {
                                replyComment(e, data.article_comment[0].id);
                                setIsAnswering(true);
                              }}
                              className="ml-3"
                              width="20"
                              height="20"
                              src="/icon/Back.svg"
                            />
                          )}

                          <p className="mx-3">
                            {getDate(data.article_comment[0].created_at)}
                          </p>
                          <p className="ml-3">
                            {getTime(data.article_comment[0].created_at)}
                          </p>
                        </Row>
                      </Col>
                    )}
                    {userInfo.user.id !== props.user.id && (
                      <ItemComment
                        comment={data.article_comment[0]}
                        replyComment={replyComment}
                        isResponse={false}
                        isSecondResponse={false}
                      />
                    )}

                    {data.article_comment[0].responses.map(response => (
                      <Col xs={12} key={response.id}>
                        {response.user.id !== userInfo.user.id && (
                          <ItemComment
                            comment={response}
                            replyComment={replyComment}
                            isResponse={true}
                            isSecondResponse={false}
                          />
                        )}
                        {response.user.id === userInfo.user.id && (
                          <div className="ml-3">
                            <Row className="d-flex justify-content-end mx-3">
                              <p>Vous</p>
                              <Image
                                onClick={() => {
                                  setCanModify(true);
                                  setCurrentComment(response);
                                }}
                                className="img-update ml-3"
                                width="20"
                                height="20"
                                src="/icon/Couronne.svg"
                              />
                              <Image
                                className="ml-3 user-comment"
                                width="20"
                                height="20"
                                src="/icon/Profil-femme-1.svg"
                              />
                            </Row>
                            <Row className="d-flex justify-content-end mx-3">
                              <div
                                className={
                                  !response.responses[0]
                                    ? "comment-sender shadow"
                                    : "comment-sender shadow hasChild"
                                }
                              >
                                <p> {response.comment}</p>
                              </div>
                            </Row>
                            <Row className="comment-footer d-flex justify-content-end mx-3 mt-3">
                              {data.article_comment[0] && props.user && (
                                <Image
                                  id={response.id}
                                  onClick={e => {
                                    replyComment(e, response.id);
                                    setIsAnswering(true);
                                  }}
                                  className="ml-3"
                                  width="20"
                                  height="20"
                                  src="/icon/Back.svg"
                                />
                              )}

                              <p className="mx-3">
                                {getDate(response.created_at)}
                              </p>
                              <p className="ml-3">
                                {getTime(response.created_at)}
                              </p>
                            </Row>
                          </div>
                        )}
                        {response.responses.map(res => (
                          <div key={res.id}>
                            <div>
                              {res.user.id !== userInfo.user.id && (
                                <ItemComment
                                  comment={res}
                                  replyComment={replyComment}
                                  isResponse={false}
                                  isSecondResponse={true}
                                />
                              )}
                            </div>
                            <div>
                              {res.user.id === userInfo.user.id && (
                                <div className="ml-5">
                                  <Row className="d-flex justify-content-end mx-3">
                                    <p>Vous</p>
                                    <Image
                                      onClick={() => {
                                        setCanModify(true);
                                        setCurrentComment(res);
                                      }}
                                      className="img-update ml-3"
                                      width="20"
                                      height="20"
                                      src="/icon/Couronne.svg"
                                    />
                                    <Image
                                      className="ml-3 user-comment"
                                      width="20"
                                      height="20"
                                      src="/icon/Profil-femme-1.svg"
                                    />
                                  </Row>
                                  <Row className="d-flex justify-content-end mx-3">
                                    <div className=" comment-sender shadow">
                                      <p> {res.comment}</p>
                                    </div>
                                  </Row>
                                  <Row className="comment-footer d-flex justify-content-end mx-3 mt-3">
                                    <p className="mx-3">
                                      {getDate(res.created_at)}
                                    </p>
                                    <p className="ml-3">
                                      {getTime(res.created_at)}
                                    </p>
                                  </Row>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
              {data.article_comment[0] && canModify && (
                <Container className="pl-0">
                  <AddComment
                    comment={currentComment}
                    reply={null}
                    article={props.article}
                    user={userInfo.user.id}
                    onHideForm={() => setCanModify(false)}
                    type="edit"
                  />
                </Container>
              )}
            </div>
          )}
        </Container>
      )}
      {show &&
        !data.article_comment[0] &&
        props.user &&
        userInfo.user.id !== props.user.id && (
          <div className="bg-white shadow p-3">
            <Row>
              <Col>
                <p>Cette personne n&apos;a pas encore mis de commentaire.</p>
              </Col>
            </Row>
          </div>
        )}
    </Container>
  );
}
ModalComment.propTypes = {
  onHide: PropTypes.func,
  show: PropTypes.bool,
  article: PropTypes.number,
  user: PropTypes.object,
  name: PropTypes.string
};
