import React, { Component } from 'react';
import Header from './Header/Header';
import Welcome from './Welcome';
import SideBar from './SideBar/SideBar';
import PropTypes from 'prop-types';
import $ from "jquery";
import { connect } from "react-redux";

import { fetchPlayer } from "../Data/Player/playerActions";
import LoadingUser from './LoadingUser/LoadingUser';
import ChartList from './Charts/ChartList';
import Footer from './Footer';

class Statistics extends Component {
  static propTypes = {
    getPlayerData: PropTypes.func.isRequired,
    user: PropTypes.string,
    showLoading: PropTypes.bool.isRequired,
    showStatistics: PropTypes.bool.isRequired,
  }

  scrollToElem(id) {
    $('html,body').animate({ scrollTop: $("#" + id).offset().top }, 'fast');
  }

  componentDidMount() {
    if (this.props.user) {
      this.props.getPlayerData(this.props.user);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.props.getPlayerData(nextProps.user);
    }
  }

  render() {
    return (
      <main className="App">
        <Header />
        <div className="container">
          <div className="row">
            <SideBar scrollToElem={this.scrollToElem} />
            <div className="col-lg-9 order-md-1 col-md-8 content-wrapper">
              {this.props.showLoading
                ? <LoadingUser />
                : this.props.showStatistics
                  ? <ChartList />
                  : <Welcome />}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }
}

const mapReduxStateToProps = ({ player, games }) => ({
  showLoading: !!player.fetching || !!player.fetchError || !!games.fetching || !!games.fetchError,
  showStatistics: games.results.length > 0
})

const mapReduxDispatchToProps = dispatch => ({
  getPlayerData: player => dispatch(fetchPlayer(player))
})

export default connect(mapReduxStateToProps, mapReduxDispatchToProps)(Statistics);
