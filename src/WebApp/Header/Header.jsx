import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from "react-redux";

import { Helmet } from "react-helmet";
import { getPlayerRankDisplay } from "../../Shared/utils";


class Header extends Component {
  static propTypes = {
    player: PropTypes.shape({
      username: PropTypes.string,
      rank: PropTypes.number
    })
  }

  render() {
    const pageTitle = this.props.player.username ? `statistics for player ${this.props.player.username} (${getPlayerRankDisplay(this.props.player)})` : "statistics";
    const title = `${this.props.player.username && `${this.props.player.username} statistics | `}Got Stats?`
    return (
      <nav className="navbar navbar-dark Header justify-content-start">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <a href={`${process.env.PUBLIC_URL}/`} className="navbar-brand">
          <img className="OGS_logo d-inline-block align-top" src="https://cdn.online-go.com/assets/ogs_dark.svg" alt="OGS logo" />
        </a>
        <h1 className="page_title">{pageTitle}</h1>
      </nav>
    );
  }
}

const mapReduxStateToProps = ({ player }) => ({ player })

export default connect(mapReduxStateToProps)(Header);
