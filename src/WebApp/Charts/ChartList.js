import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import WinLoseChart from "./WinLoseChart";
import ResultDistributionChart from "./ResultDistributionChart";
import BoardSizesChart from "./BoardSizesChart";
import TimeSettingsChart from "./TimeSettingsChart";
import OpponentChart from "./OpponentChart";
import MiscChart from "./MiscChart";
import ChartFilter from "../GameFilters/ChartFilter";
import GameHistoryChart from "./GameHistoryChart";

class ChartList extends Component {
  static propTypes = {
    games: PropTypes.object.isRequired,
    chartsData: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired,
  };

  render() {
    const { player, chartsData, games } = this.props;

    const filteredGamesData = chartsData.results;
    const allGamesData = games.results;

    return (
      <div>
        <ChartFilter />

        <hr />
        <h2 id="total_games_stats" className="text-center">
          {`${filteredGamesData.length} of ${allGamesData.length} games match the filters`}
        </h2>

        {filteredGamesData.length > 0 && (
          <div>
            <GameHistoryChart
              games={filteredGamesData}
              player={player}
              insertCurrentRank={!chartsData.limitEndDate}
            />

            <WinLoseChart games={filteredGamesData} player={player} />

            <ResultDistributionChart
              title={`Game results distribution`}
              id={"game_results"}
              games={filteredGamesData}
              player={player}
            />
            {chartsData.boardSize.length > 1 && (
              <BoardSizesChart
                title={`Performance across board sizes`}
                id={"board_sizes_stats"}
                games={filteredGamesData}
                player={player}
              />
            )}
            {chartsData.timeSettings.length > 1 && (
              <TimeSettingsChart
                title={`Performance across time settings`}
                id={"time_settings_stats"}
                games={filteredGamesData}
                player={player}
              />
            )}
            <OpponentChart
              title={`Unique opponents faced`}
              id={"opponents_stats"}
              games={filteredGamesData}
              player={player}
            />
            <MiscChart
              title={`Miscellaneous`}
              id={"misc_stats"}
              games={filteredGamesData}
              player={player}
            />
          </div>
        )}
      </div>
    );
  }
}
const mapReduxStateToProps = ({ chartsData, games, player }) => ({
  chartsData,
  games,
  player,
});

export default connect(mapReduxStateToProps)(ChartList);
