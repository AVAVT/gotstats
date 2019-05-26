import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SearchBox from './SearchBox';
import QuickLinks from './QuickLinks';

import { connect } from "react-redux";

class SideBar extends Component {
  static propTypes = {
    scrollToElem: PropTypes.func.isRequired,
    showQuickLinks: PropTypes.bool
  }

  render() {
    const navi = this.props.showQuickLinks ? (
      <div className="navi hidden-sm hidden-xs">
        <hr />
        <QuickLinks scrollToElem={this.props.scrollToElem} />
      </div>
    ) : null;

    return (
      <div className="col-lg-3 col-md-4 order-md-2 sidebar">
        <nav className="side_nav sticky-top">
          <SearchBox />

          {navi}
        </nav>
      </div>
    );
  }
}
const mapReduxStateToProps = ({ chartsData }) => ({ showQuickLinks: chartsData.length > 0 })
export default connect(mapReduxStateToProps)(SideBar);
