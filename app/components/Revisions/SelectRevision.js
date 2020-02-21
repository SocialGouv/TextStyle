import React from "react";
import PropTypes from "prop-types";
import { FormControl, Col } from "react-bootstrap";

export default class SelectRevision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.articleRevision[props.articleRevision.length - 1]
        ? props.articleRevision[props.articleRevision.length - 1].id
        : ""
    };
    this.changeSelect = this.changeSelect.bind(this);
  }

  changeSelect() {
    var handleToUpdate = this.props.handleToUpdate;
    this.setState({
      value: event.target.value
    });
    handleToUpdate(event.target.value);
  }

  render() {
    var selectHidden = this.props.articleRevision.length > 0;
    return (
      <Col xs={6} md={7} className="mt-4 px-0">
        {selectHidden && (
          <FormControl
            size="lg"
            className="select-revision"
            as="select"
            onChange={this.changeSelect}
            value={this.state.value}
            disabled={!this.state.value}
          >
            {this.props.articleRevision &&
              this.props.articleRevision.map(article => (
                <option key={article.id} value={article.id}>
                  {article.name}
                </option>
              ))}
          </FormControl>
        )}
      </Col>
    );
  }
}

SelectRevision.propTypes = {
  articleRevision: PropTypes.array,
  handleToUpdate: PropTypes.func
};
