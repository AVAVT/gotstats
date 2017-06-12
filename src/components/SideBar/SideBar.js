import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SearchBox from './SearchBox';
import QuickLinks from './QuickLinks';

class SideBar extends Component {
  render() {
    return (
      <div className="col-md-3 col-md-push-9 col-sm-4 col-sm-push-8 sidebar">
        <nav className="side_nav" data-spy="affix" data-offset-top="95">
          <SearchBox goToUser={this.props.goToUser}/>

          <div className="navi hidden-sm hidden-xs" ng-hide="!$root.ready">
            <hr />
            <QuickLinks scrollToElem={this.props.scrollToElem} />
          </div>
        </nav>
  		</div>
    );
  }
}

SideBar.propTypes = {
  scrollToElem : PropTypes.func.isRequired,
  goToUser : PropTypes.func.isRequired
}

export default SideBar;
