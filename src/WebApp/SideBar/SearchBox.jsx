import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { saveAs } from 'file-saver';
import { importPlayer, fetchPlayer } from "../../Redux/Player/playerActions";

const exporterVersion = 0;

class SearchBox extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  state = {
    username: ""
  }

  updateSearchUser = (event) => {
    this.setState({
      username: event.target.value
    });
  }

  submit = (event) => {
    event.preventDefault();

    if (this.state.username) {
      this.props.history.push(`/user/${this.state.username}`)
      this.props.getPlayerData(this.state.username);

      this.setState({
        username: ''
      });

      if (document.activeElement) {
        document.activeElement.blur();
      }
    }
  }

  downloadJSON = () => {
    const {
      id,
      username,
      ratings,
      rank,
      registrationDate
    } = this.props.player;

    const {
      start,
      end,
      results
    } = this.props.games;

    const jsonString = JSON.stringify({
      exporterVersion,
      player: {
        id,
        username,
        ratings,
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
    window.alert("Player data file exported.\nYou can use it for quick import in the future.")
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
    this.props.history.push(`/user/${data.player.username}`)
    this.props.importPlayerData(data);
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <div className="form-group">
          <div className="input-group">
            <input value={this.state.username} onChange={this.updateSearchUser} name="id" type="text" placeholder="Username or ID" className="form-control" />
            <span className="input-group-btn">
              <button type="submit" className="btn btn-primary">Got Stats?</button>
            </span>
          </div>
        </div>

        <p className="text-center"><small className="tip help-block"><em>-- or --</em></small></p>

        <div className="form-group">
          <p className="d-flex justify-content-between">
            <input type="file" onChange={this.readFile} id="file_input" style={{ display: 'none' }} />
            <button className="btn btn-secondary" onClick={() => document.getElementById("file_input").click()}>Import Data</button>
            {this.props.games.results.length > 0 && (<button className="btn btn-secondary" onClick={this.downloadJSON}>Export Data</button>)}
          </p>
        </div>
      </form>
    );
  }
}

const mapReduxStateToProps = ({ player, games }) => ({ player, games })
const mapDispatchToProps = (dispatch) => ({
  importPlayerData: data => dispatch(importPlayer(data)),
  getPlayerData: player => dispatch(fetchPlayer(player))
})

export default withRouter(connect(mapReduxStateToProps, mapDispatchToProps)(SearchBox));
