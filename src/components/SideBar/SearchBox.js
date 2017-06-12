import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SearchBox extends Component {
  constructor(props){
    super(props);

    this.state = {
      username : ""
    }

    this.updateSearchUser = this.updateSearchUser.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  updateSearchUser(event){
    this.setState({
      username : event.target.value
    });
  }

  submitHandler(event){
    // event.preventDefault(); wtf jest
    this.props.goToUser(this.state.username);
  }

  render() {
    return (
      <form name="searchForm" onSubmit={this.submitHandler}>
        <div className="input-group">
          <input value={this.state.username} onChange={this.updateSearchUser} name="id" type="text" required placeholder="Username or ID" className="form-control" />
          <span className="input-group-btn">
            <button className="btn btn-primary" type="submit">g0t Stats?</button>
          </span>
        </div>
        <small className="tip help-block"><em>*Tip: mouse over/tap on a chart to see more info.</em></small>
      </form>
    );
  }
}

SearchBox.propTypes = {
  goToUser : PropTypes.func.isRequired
}

export default SearchBox;
