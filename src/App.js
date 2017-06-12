import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';

import PropTypes from 'prop-types';

import './App.css';

import Header from './components/Header';
import SideBar from './components/SideBar/SideBar';
import Welcome from './views/Welcome';
import Welcome2 from './views/Welcome2';

const routes = [
  {
    path: '/',
    exact: true,
    component: Welcome
  },
  {
    path: '/:id',
    component: Welcome2
  }
]

class App extends Component {

  constructor(props){
    super(props);

    this.goToUser = this.goToUser.bind(this);
  }

  scrollToElem(id){

  }

  goToUser(username){
    // TODO
    withRouter(({ history }) => history.push(`/${username}`));
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <div className="container stats_content">
      			<div className="row">
              <SideBar scrollToElem={this.scrollToElem} goToUser={this.goToUser} />
              <div className="col-md-9 col-md-pull-3 col-sm-8 col-sm-pull-4">
                {routes.map((route, index) => (
                  <Route key={index} {...route} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
export default App;
