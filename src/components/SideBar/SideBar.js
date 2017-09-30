import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import SearchBox from './SearchBox';
import QuickLinks from './QuickLinks';

class SideBar extends Component {
  static propTypes = {
    scrollToElem: PropTypes.func.isRequired,
    quickLinks  : PropTypes.array
  }

  render() {
    const navi = this.props.quickLinks ? (
      <div className="navi hidden-sm hidden-xs" ng-hide="!$root.ready">
        <hr />
        <QuickLinks scrollToElem={this.props.scrollToElem} />
      </div>
    ) : null;

    return (
      <div className="col-lg-3 col-md-4 order-md-2 sidebar">
        <nav className="side_nav sticky-top">
          <SearchBox history={this.props.history}/>

          {navi}
        </nav>
  		</div>
    );
  }
}

export default withRouter(SideBar);
