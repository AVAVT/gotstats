import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class SearchBox extends Component {
  constructor(props){
    super(props);

    this.state = {
      username : "",
      redirect : false
    }

    this.updateSearchUser = this.updateSearchUser.bind(this);
    this.submit = this.submit.bind(this);
  }

  updateSearchUser(event){
    this.setState({
      username : event.target.value,
      redirect : false
    });
  }

  submit(event){
    event.preventDefault();

    this.setState({
      redirect : true
    });

    if(document.activeElement){
      document.activeElement.blur();
    }
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <div className="input-group">
          <input value={this.state.username} onChange={this.updateSearchUser} name="id" type="text" required placeholder="Username or ID" className="form-control" />
          <span className="input-group-btn">
            <button type="submit" className="btn btn-primary">g0t Stats?</button>
          </span>
        </div>
        <small className="tip help-block"><em>*Tip: mouse over/tap on a chart to see more info.</em></small>
        {
          this.state.redirect && (
          <Redirect to={`/${this.state.username}`} push />
          )
        }
      </form>
    );
  }
}

export default SearchBox;
