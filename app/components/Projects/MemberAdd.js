import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ModalAddMembers from "../Modals/ModalAddMembers";
import { Col, Image, Row } from "react-bootstrap";
import PropTypes from "prop-types";

export default function MemberAdd(props) {
  const [modalShow, setModalMember] = useState(false);
  const listMembers = props.selectedMemberProject.map((member, index) => (
    <Col xs={12} sm={12} md={6} lg={4} key={index} className="mt-5 px-0">
      <Row>
        <Col xs={5} sm={4} md={5} lg={5}>
          <Image src={"/images/dashed_person.png"} alt="person image" />
        </Col>
        <Col xs={7} sm={8} md={7} lg={7} xl={6} className="px-3">
          <Row>
            <h3>
              {member.firstName} {member.lastName}
            </h3>
          </Row>
          <Row>
            <h5>{member.ministry}</h5>
            <h5>{member.management}</h5>
          </Row>
        </Col>
      </Row>
    </Col>
  ));
  const toolbar = (
    <ButtonToolbar className="ml-3 mt-3">
      <Button
        variant="link"
        className="btn-add-member"
        onClick={() => setModalMember(true)}
      >
        <img src={"/icon/Plus.svg"} width="50" height="50" alt="plus icon" />
      </Button>
      <ModalAddMembers
        show={modalShow}
        onHide={() => setModalMember(false)}
        users={props.filterData}
        onRegister={props.registerMember}
        defaults={props.selectedMemberProject}
        name={props.name}
      />
    </ButtonToolbar>
  );

  return (
    <span>
      {!props.members && toolbar}
      {props.members && (
        <Row className="px-0 align-items-center  ml-0">
          {listMembers}
          {toolbar}
        </Row>
      )}
    </span>
  );
}

MemberAdd.propTypes = {
  selectedMemberProject: PropTypes.array,
  filterData: PropTypes.array,
  name: PropTypes.string,
  registerMember: PropTypes.func,
  members: PropTypes.bool
};
