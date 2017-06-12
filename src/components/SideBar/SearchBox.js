import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SearchBox extends Component {
  constructor(props){
    super(props);

    this.state = {
      username : ""
    }

    this.updateSearchUser = this.updateSearchUser.bind(this);
  }

  updateSearchUser(event){
    this.setState({
      username : event.target.value
    });
  }

  render() {
    return (
      <div>
        <div className="input-group">
          <input value={this.state.username} onChange={this.updateSearchUser} name="id" type="text" required placeholder="Username or ID" className="form-control" />
          <span className="input-group-btn">
            <Link to={`/${this.state.username}`} className="btn btn-primary">g0t Stats?</Link>
          </span>
        </div>
        <small className="tip help-block"><em>*Tip: mouse over/tap on a chart to see more info.</em></small>
      </div>
    );
  }
}

export default SearchBox;
