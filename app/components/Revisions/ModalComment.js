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
      const lastComment = document.getElementById(currentCommentId);
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
    const lastComment = document.getElementById(currentCommentId);
    if (lastComment) {
      lastComment.style.display = "block";
    }
    const selected = document.getElementById(id);
    selected.style.display = "none";
    setCurrentCommentId(id);
    setCanModify(false);
    setIsAnswering(true);
  };
  const modifyComment = comment => {
    setCanModify(true);
    setCurrentComment(comment);
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
                      <ItemComment
                        comment={data.article_comment[0]}
                        modifyComment={modifyComment}
                        replyComment={replyComment}
                        isResponse={false}
                        isSecondResponse={false}
                        isSender={true}
                      />
                    )}
                    {userInfo.user.id !== props.user.id && (
                      <ItemComment
                        comment={data.article_comment[0]}
                        replyComment={replyComment}
                        isResponse={false}
                        isSecondResponse={false}
                        isSender={false}
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
                            isSender={false}
                          />
                        )}
                        {response.user.id === userInfo.user.id && (
                          <ItemComment
                            comment={response}
                            modifyComment={modifyComment}
                            replyComment={replyComment}
                            isResponse={true}
                            isSecondResponse={false}
                            isSender={true}
                          />
                        )}
                        {response.responses.map(res => (
                          <Col xs={12} key={res.id}>
                            {res.user.id !== userInfo.user.id && (
                              <ItemComment
                                comment={res}
                                replyComment={replyComment}
                                isResponse={false}
                                isSecondResponse={true}
                                isSender={false}
                              />
                            )}

                            {res.user.id === userInfo.user.id && (
                              <ItemComment
                                comment={res}
                                modifyComment={modifyComment}
                                replyComment={replyComment}
                                isResponse={false}
                                isSecondResponse={true}
                                isSender={true}
                              />
                            )}
                          </Col>
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
