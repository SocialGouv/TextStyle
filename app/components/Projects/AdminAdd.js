import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ModalAddMembers from "../Modals/ModalAddMembers";
import { Col, Image, Row } from "react-bootstrap";
import PropTypes from "prop-types";

export default function AdminAdd(props) {
  const [modalAdmin, setModalAdmin] = useState(false);
  const listAdmin = props.selectedAdminProject.map((admin, index) => (
    <Col xs={12} sm={12} md={6} lg={4} key={index} className="mt-5 px-0">
      <Row>
        <Col xs={5} sm={4} md={5} lg={5}>
          <Image src={"/images/dashed_person.png"} alt="person image" />
        </Col>
        <Col xs={7} sm={8} md={7} lg={7} xl={6} className="px-3">
          <Row>
            <h3>
              {admin.firstName} {admin.lastName}
            </h3>
          </Row>
          <Row>
            <h5>{admin.ministry}</h5>
            <h5>{admin.management}</h5>
          </Row>
        </Col>
      </Row>
    </Col>
  ));
  const admintoolbar = (
    <ButtonToolbar className="ml-3 mt-3">
      <Button
        variant="secondary"
        className="btn-add-member"
        onClick={() => setModalAdmin(true)}
      >
        <img src={"/icon/Plus.svg"} width="50" height="50" alt="plus icon" />
      </Button>
      <ModalAddMembers
        show={modalAdmin}
        onHide={() => setModalAdmin(false)}
        users={props.filterData}
        onRegister={props.registerAdmin}
        defaults={props.selectedAdminProject}
        name={props.name}
      />
    </ButtonToolbar>
  );

  return (
    <span>
      {!props.admins && admintoolbar}
      {props.admins && (
        <Row className="px-0 align-items-center  ml-0">
          {listAdmin}
          {admintoolbar}
        </Row>
      )}
    </span>
  );
}

AdminAdd.propTypes = {
  selectedAdminProject: PropTypes.array,
  filterData: PropTypes.array,
  name: PropTypes.string,
  admins: PropTypes.bool,
  registerAdmin: PropTypes.func
};
