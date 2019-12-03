import React from "react";

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
    return (
      <div className="mt-4">
        <select
          onChange={this.changeSelect}
          value={this.state.value}
          disabled={this.state.value ? false : true}
        >
          {this.props.articleRevision &&
            this.props.articleRevision.map(article => (
              <option key={article.id} value={article.id}>
                {article.name}
              </option>
            ))}
        </select>
      </div>
    );
  }
}
