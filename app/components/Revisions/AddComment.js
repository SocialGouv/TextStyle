import React from "react";
import Button from "react-bootstrap/Button";
import { useMutation } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import { EDIT_COMMENT, INSERT_COMMENT } from "./queries";
import { Col, Row, FormControl } from "react-bootstrap";

export default function AddComment(props) {
  const [insertComment] = useMutation(INSERT_COMMENT);
  const [editComment] = useMutation(EDIT_COMMENT);

  let inputComment = "";
  const { onHideForm, type, comment } = props;
  return (
    <form
      className="mt-3"
      onSubmit={e => {
        e.preventDefault();
        onHideForm();
        if (type === "add") {
          insertComment({
            variables: {
              reply: props.reply,
              article: props.article,
              comment: inputComment.value,
              user: props.user
            },
            refetchQueries: ["GET_LIST_COMMENT_ARTICLE_QUERY"]
          });
          var selected = document.getElementById(props.reply);
          if (selected !== null) selected.style.display = "block";
        } else if (type === "edit") {
          editComment({
            variables: {
              id: comment.id,
              comment: inputComment.value
            },
            refetchQueries: ["GET_LIST_COMMENT_ARTICLE_QUERY"]
          });
        }
      }}
    >
      <div className="bg-white shadow mt-3 p-3">
        <Row>
          <Col>
            <FormControl
              required
              placeholder="Rédigez votre commentaire..."
              name="Commentaire du projet"
              className="col-12"
              as="textarea"
              rows="3"
              defaultValue={comment === null ? "" : comment.comment}
              ref={node => {
                inputComment = node;
              }}
            />
          </Col>
        </Row>
      </div>
      <Row className="mx-0 my-3 justify-content-end">
        <Button className="buttonLeft" type="submit" size="lg">
          Commenter
        </Button>
      </Row>
    </form>
  );
}
AddComment.propTypes = {
  onHideForm: PropTypes.func,
  article: PropTypes.number,
  reply: PropTypes.number,
  user: PropTypes.number,
  type: PropTypes.string,
  comment: PropTypes.object
};
