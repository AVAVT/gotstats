import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';

class SearchBox extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  state = {
    username: ""
  }

  updateSearchUser = (event) => {
    this.setState({
      username: event.target.value
    });
  }

  submit = (event) => {
    event.preventDefault();

    this.props.history.push(`/user/${this.state.username}`)

    this.setState({
      username: ''
    });

    if (document.activeElement) {
      document.activeElement.blur();
    }
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <div className="input-group">
          <input value={this.state.username} onChange={this.updateSearchUser} name="id" type="text" required placeholder="Username or ID" className="form-control" />
          <span className="input-group-btn">
            <button type="submit" className="btn btn-primary">Got Stats?</button>
          </span>
        </div>
        <small className="tip help-block"><em>*Tip: mouse over/tap on a chart to see more info.</em></small>
      </form>
    );
  }
}

export default withRouter(SearchBox);