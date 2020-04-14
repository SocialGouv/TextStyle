import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";
import Image from "react-bootstrap/Image";

export default function ItemComment(props) {
  const { comment, replyComment, isResponse, isSecondResponse } = props;
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
  return (
    <Col
      xs={12}
      className={
        "comment-reciv " +
        (!isResponse ? "" : "ml-3") +
        (!isSecondResponse ? "" : "ml-4")
      }
    >
      <Row className="d-flex mx-3">
        <Image
          className="mr-3 user-comment"
          width="20"
          height="20"
          src="/icon/Profil-femme-1.svg"
        />
        <p>
          {comment.user.firstName} {comment.user.lastName}
        </p>
      </Row>
      <Row className="d-flex mx-3">
        <div
          className={
            "shadow " +
            (isSecondResponse || !comment.responses[0] ? "" : "hasChild")
          }
        >
          <p> {comment.comment}</p>
        </div>
      </Row>
      <Row className="comment-footer d-flex mx-3 mt-3">
        <p className="mx-3">{getDate(comment.created_at)}</p>
        <p className="ml-3">{getTime(comment.created_at)}</p>

        {!isSecondResponse && (
          <Image
            id={comment.id}
            onClick={e => {
              replyComment(e, comment.id);
            }}
            className="mx-3"
            width="20"
            height="20"
            src="/icon/BackRecip.svg"
          />
        )}
      </Row>
    </Col>
  );
}
ItemComment.propTypes = {
  replyComment: PropTypes.func,
  comment: PropTypes.object,
  isResponse: PropTypes.bool,
  isSecondResponse: PropTypes.bool
};
