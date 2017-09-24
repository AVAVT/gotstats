import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route
} from 'react-router-dom';
import $ from 'jquery';

import configs from './configs.json';

import Header from './components/Header';
import SideBar from './components/SideBar/SideBar';
import Welcome from './views/Welcome';
import UserStatistics from './views/UserStatistics';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      userData : null
    }

    this.updateUserInfo = this.updateUserInfo.bind(this);
  }

  scrollToElem(id){
    $('html,body').animate({scrollTop: $("#"+id).offset().top},'fast');
  }

  updateUserInfo(userData){
    this.setState({
      userData : userData
    });
  }

  render() {
    const routes = [
      {
        path     : '/',
        exact    : true,
        component: Welcome
      },
      {
        path          : '/:id',
        render        : (props) => {
          return (
            <UserStatistics {...Object.assign({
              apiRoot       : configs.OGS_API_ROOT,
              userData      : this.state.userData,
              updateUserInfo: this.updateUserInfo
            }, props)}  />
          );
        },
      }
    ]

    return (
      <Router>
        <div className="App">
          <Header {...this.state.userData} />
          <div className="container stats_content">
      			<div className="row">
              <SideBar scrollToElem={this.scrollToElem} />
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
