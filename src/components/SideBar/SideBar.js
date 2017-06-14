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
      <div className="col-md-3 col-md-push-9 col-sm-4 col-sm-push-8 sidebar">
        <nav className="side_nav" data-spy="affix" data-offset-top="95">
          <SearchBox history={this.props.history}/>

          {navi}
        </nav>
  		</div>
    );
  }
}

export default withRouter(SideBar);
