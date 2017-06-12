import React, { Component } from 'react';
import './App.css';

import Header from './components/Header';
import SideBar from './components/SideBar/SideBar';
import Welcome from './views/Welcome';

class App extends Component {
  scrollHandler(id){

  }

  fetchUserData(username){

  }

  render() {
    return (
      <div className="App">
        <Header />
        <div className="container stats_content">
    			<div className="row">
            <SideBar scrollHandler={this.scrollHandler} fetchUserData={this.fetchUserData} />
            <div className="col-md-9 col-md-pull-3 col-sm-8 col-sm-pull-4">
              <Welcome />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
