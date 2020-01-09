import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Row } from "react-bootstrap";
import AddAdministrator from "./AddAdministrator";
import DeleteAdministrator from "./DeleteAdministrator";

export default function AdministratorBloc(props) {
  const { user, administrator, administratorCount, project } = props;
  let potentialAdministratorList = [];
  let administratorList = [];

  if (administrator) {
    potentialAdministratorList = user.filter(
      elem =>
        !administrator.find(
          ({ administrator_id }) => elem.id === administrator_id
        )
    );

    administratorList = user.filter(elem =>
      administrator.find(({ administrator_id }) => elem.id === administrator_id)
    );
  }

  return (
    <Card className="card-list">
      <Card.Header className="custom-header">
        Administrateur du projet
      </Card.Header>
      <Card.Body>
        <div className="card-editors">
          <Card.Text className="mb-3">
            Il y a actuellement {administratorCount} administrateur
            {administratorCount > 1 ? "s" : ""}
          </Card.Text>
          <Row className="mt-3">
            <Col sm={12} md={6}>
              {administratorCount > 0
                ? administratorList &&
                  administratorList.map(admin => (
                    <Card.Title key={admin.id}>
                      - {admin.username} / {admin.email}{" "}
                      <DeleteAdministrator
                        project={project}
                        administrator={admin.id}
                      />
                    </Card.Title>
                  ))
                : ""}
            </Col>
            <Col sm={12} md={6}>
              <AddAdministrator
                administratorList={potentialAdministratorList}
                project={project}
              />
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
}

AdministratorBloc.propTypes = {
  user: PropTypes.array,
  administrator: PropTypes.array,
  administratorCount: PropTypes.number,
  project: PropTypes.string
};
