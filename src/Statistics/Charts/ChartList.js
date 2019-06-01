import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import WinLoseChart from './WinLoseChart';
import ResultDistributionChart from './ResultDistributionChart';
import BoardSizesChart from './BoardSizesChart';
import TimeSettingsChart from './TimeSettingsChart';
import OpponentChart from './OpponentChart';
import MiscChart from './MiscChart';
import ChartFilter from '../GameFilters/ChartFilter';
import GameHistoryChart from './GameHistoryChart';


class ChartList extends Component {
  static propTypes = {
    games: PropTypes.object.isRequired,
    chartsData: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired
  }

  createGameData(games) {
    return {
      playerId: this.props.player.id,
      games: games
    }
  }

  render() {
    const filteredGamesData = this.createGameData(this.props.chartsData.results);
    const allGamesData = this.createGameData(this.props.games.results);

    const charts = filteredGamesData.games.length > 0 && (
      <div>
        <GameHistoryChart
          gamesData={filteredGamesData}
          player={this.props.player} />

        <WinLoseChart
          gamesData={filteredGamesData}
        />

        <ResultDistributionChart
          title={`Game results distribution`}
          id={"game_results"}
          gamesData={filteredGamesData}
          player={this.props.player}
        />
        {
          this.props.chartsData.boardSize.length > 1 && (
            <BoardSizesChart
              title={`Performance across board sizes`}
              id={"board_sizes_stats"}
              gamesData={filteredGamesData}
            />
          )
        }
        {
          this.props.chartsData.timeSettings.length > 1 && (
            <TimeSettingsChart
              title={`Performance across time settings`}
              id={"time_settings_stats"}
              gamesData={filteredGamesData}
            />
          )
        }
      </div>
    )


    return (
      <div>
        <ChartFilter />

        <hr />
        <h2 id="total_games_stats" className="text-center">{`${filteredGamesData.games.length} of ${allGamesData.games.length} games match the filters`}</h2>

        {charts}

        {
          allGamesData.games.length > 0 && (
            <div>
              <h2 className="all_time_title">Lifetime Statistics</h2>
              <OpponentChart
                title={`Unique opponents faced`}
                id={"opponents_stats"}
                gamesData={allGamesData}
                player={this.props.player}
              />
              <MiscChart
                title={`Miscellaneous`}
                id={"misc_stats"}
                gamesData={allGamesData}
                player={this.props.player}
              />
            </div>
          )
        }
      </div>
    );
  }
}
const mapReduxStateToProps = ({ chartsData, games, player }) => ({ chartsData, games, player });

export default connect(mapReduxStateToProps)(ChartList);
