import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Row } from "react-bootstrap";
import AddWriter from "./AddWriter";
import DeleteWriter from "./DeleteWriter";

export default function WriterBloc(props) {
  const { user, writer, writerCount, project } = props;
  let potentialWriterList = [];
  let writerList = [];

  if (writer) {
    potentialWriterList = user.filter(
      elem => !writer.find(({ writer_id }) => elem.id === writer_id)
    );

    writerList = user.filter(elem =>
      writer.find(({ writer_id }) => elem.id === writer_id)
    );
  }

  return (
    <Card className="card-list">
      <Card.Header className="custom-header">Utilisateur du projet</Card.Header>
      <Card.Body>
        <div className="card-editors">
          <Card.Text className="mb-3">
            Il y a actuellement {writerCount} utilisateur
            {writerCount > 1 ? "s" : ""}
          </Card.Text>
          <Row className="mt-3">
            <Col sm={12} md={6}>
              {writerCount > 0
                ? writerList &&
                  writerList.map(user => (
                    <Card.Title key={user.id}>
                      - {user.username} / {user.email}{" "}
                      <DeleteWriter project={project} writer={user.id} />
                    </Card.Title>
                  ))
                : ""}
            </Col>
            <Col sm={12} md={6}>
              <AddWriter writerList={potentialWriterList} project={project} />
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
}

WriterBloc.propTypes = {
  user: PropTypes.array,
  writer: PropTypes.array,
  writerCount: PropTypes.number,
  project: PropTypes.string
};
