import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SearchBox from './SearchBox';
import QuickLinks from './QuickLinks';

class SideBar extends Component {
  render() {
    return (
      <div className="col-md-3 col-md-push-9 col-sm-4 col-sm-push-8 sidebar">
        <nav className="side_nav" data-spy="affix" data-offset-top="95">
          <SearchBox fetchUserData={this.props.fetchUserData}/>

          <div className="navi hidden-sm hidden-xs" ng-hide="!$root.ready">
            <hr />
            <QuickLinks scrollHandler={this.props.scrollHandler} />
          </div>
        </nav>
  		</div>
    );
  }
}

SideBar.propTypes = {
  scrollHandler : PropTypes.func.isRequired,
  fetchUserData : PropTypes.func.isRequired
}

export default SideBar;
