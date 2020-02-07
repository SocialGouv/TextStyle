import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Typeahead } from "react-bootstrap-typeahead";
import { Col, Image, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import FormGroup from "react-bootstrap/FormGroup";

export default function ModalAddMembers(props) {
  const { show, defaults } = props;
  const [members, setMembers] = useState([]);
  const hasMembers = Object.keys(members).length !== 0;
  const hasDefaultMembers = Object.keys(defaults).length !== 0;

  const handleChange = selectedOptions => {
    setMembers(selectedOptions);
  };
  const reg = () => {
    props.onRegister(members);
    props.onHide();
  };

  useEffect(() => {}, [show, props, members]);

  const listMembres = members.map((member, index) => (
    <Col xs={6} sm={6} md={4} lg={3} key={index} className="mt-5 px-0">
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
  const listDefaultMembres = defaults.map((member, index) => (
    <Col xs={6} sm={6} md={4} lg={3} key={index} className="mt-5 px-0">
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
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="add-member-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Ajouter un {props.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup>
          <Typeahead
            multiple={true}
            id="typeahead"
            defaultSelected={defaults}
            labelKey={option => `${option.firstName} ${option.lastName}`}
            options={props.users}
            placeholder={"Choisir un " + props.name}
            onChange={handleChange}
            className="mb-5"
          />
          <i className="fa fa-search" />
        </FormGroup>
        {hasMembers && (
          <div className="home">
            <h2>Recherche</h2>
            <Row className="px-0 ml-0">{listMembres}</Row>
          </div>
        )}
        {hasDefaultMembers && !hasMembers && (
          <div className="home">
            <h2>Recherche</h2>
            <Row className="px-0 ml-0">{listDefaultMembres}</Row>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          className={
            hasMembers
              ? "my-5 add-project custom"
              : "my-5 add-project custom disabled"
          }
          variant="secondary"
          type="submit"
          onClick={reg}
        >
          Ajouter
        </Button>
      </Modal.Footer>
      <style jsx>{`
        .home {
          text-align: left;
          padding: 0;
        }
        h2 {
          color: #777777;
        }
        h5 {
          color: #777777;
        }
        h5:first-child:after {
          content: "  -  ";
          white-space: pre;
          position: relative;
          line-height: 1;
          width: 100%;
        }
      `}</style>
    </Modal>
  );
}
ModalAddMembers.propTypes = {
  name: PropTypes.string,
  onHide: PropTypes.func,
  handleChanged: PropTypes.func,
  onRegister: PropTypes.func,
  show: PropTypes.bool,
  defaults: PropTypes.array,
  users: PropTypes.array
};
