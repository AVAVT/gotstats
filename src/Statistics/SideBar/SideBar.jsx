import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SearchBox from './SearchBox';
import QuickLinks from './QuickLinks';

import { connect } from "react-redux";
import { saveAs } from 'file-saver';

class SideBar extends Component {
  static propTypes = {
    scrollToElem: PropTypes.func.isRequired,
    showQuickLinks: PropTypes.bool,
    showDatePicker: PropTypes.bool,
  }

  downloadJSON = () => {
    const {
      id,
      username,
      rating,
      rank,
      registrationDate
    } = this.props.player;

    const {
      start,
      end,
      results
    } = this.props.games;

    const jsonString = JSON.stringify({
      player: {
        id,
        username,
        rating,
        rank,
        registrationDate
      },
      games: {
        start,
        end,
        results
      }
    });

    var blob = new Blob([jsonString], { type: "text/json;charset=utf-8" });
    saveAs(blob, `gotstats_${username}.json`);
  }

  readFile = (event) => {
    const file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = (evt) => {
      this.readImportedJSON(evt.target.result);
    };
    reader.readAsText(file);
  }

  readImportedJSON = (jsonString) => {
    const data = JSON.parse(jsonString);
    console.log(data);
  }

  render() {
    const quickLinks = this.props.showQuickLinks ? (
      <div className="navi d-none d-md-block">
        <hr />
        <small className="tip help-block"><em>*Mouse over/tap on a chart to see more info.</em></small>
        <QuickLinks scrollToElem={this.props.scrollToElem} />
      </div>
    ) : null;

    return (
      <div className="col-lg-3 col-md-4 order-md-2 sidebar">
        <nav className="side_nav sticky-top">
          <SearchBox />
          {/* <p className="text-center"><small className="tip help-block"><em>-- or --</em></small></p>
          <div>
            <p className="d-flex justify-content-between">
              <input type="file" onChange={this.readFile} id="file_input" style={{ display: 'none' }} />
              <button className="btn btn-secondary" onClick={() => document.getElementById("file_input").click()}>Import Data</button>
              {this.props.games.results.length > 0 && (<button className="btn btn-secondary" onClick={this.downloadJSON}>Export Data</button>)}
            </p>
          </div> */}

          {quickLinks}

          <hr />
          <a href="https://forums.online-go.com/t/g0tstats-is-back-with-more-stats/6524" target="_blank" rel="noopener noreferrer nofollow">Support thread on OGS</a>
        </nav>
      </div>
    );
  }
}

const mapReduxStateToProps = ({ chartsData, games, player }) => ({ showQuickLinks: chartsData.results.length > 0, games, player })

export default connect(mapReduxStateToProps)(SideBar);
