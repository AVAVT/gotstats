import React, { Component } from "react";
import Header from "./Header/Header";
import Welcome from "./Welcome";
import SideBar from "./SideBar/SideBar";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { fetchPlayer } from "../Redux/Player/playerActions";
import LoadingUser from "./LoadingUser/LoadingUser";
import ChartList from "./Charts/ChartList";
import Footer from "./Footer/Footer";

class Statistics extends Component {
  static propTypes = {
    getPlayerData: PropTypes.func.isRequired,
    player: PropTypes.object.isRequired,
    user: PropTypes.string,
    showLoading: PropTypes.bool.isRequired,
    showStatistics: PropTypes.bool.isRequired,
  };

  scrollToElem(id) {
    document.getElementById(id).scrollIntoView();
  }

  componentDidMount() {
    if (this.props.user) {
      this.props.getPlayerData(this.props.user);
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
              {this.props.showStatistics ? (
                <ChartList />
              ) : this.props.showLoading ? (
                <LoadingUser />
              ) : (
                <Welcome />
              )}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }
}

const mapReduxStateToProps = ({ player, games }) => ({
  player,
  showLoading:
    !!player.fetching ||
    !!player.fetchError ||
    !!games.fetching ||
    !!games.fetchError,
  showStatistics: player.id > -1 && games.results.length > 0,
});

const mapReduxDispatchToProps = (dispatch) => ({
  getPlayerData: (player) => dispatch(fetchPlayer(player)),
});

export default connect(
  mapReduxStateToProps,
  mapReduxDispatchToProps
)(Statistics);
