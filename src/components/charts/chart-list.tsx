import { connect } from "react-redux";
import { ChartState } from "@/redux/charts/type";
import { GameState } from "@/redux/games/type";
import { PlayerState } from "@/redux/player/type";
import { StoreState } from "@/redux/type";
import ChartFilter from "../game-filters/chart-filter";
import BoardSizesChart from "./board-sizes-chart";
import GameHistoryChart from "./game-history-chart";
import MiscChart from "./misc-chart";
import OpponentChart from "./opponent-chart";
import ResultDistributionChart from "./result-distribution-chart";
import TimeSettingsChart from "./time-settings-chart";
import WinLoseChart from "./win-lose-chart";

export interface ChartListProps {
  games: GameState;
  chartsData: ChartState;
  player: PlayerState;
}

function ChartList({ games, chartsData, player }: ChartListProps) {
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
          <GameHistoryChart games={filteredGamesData} player={player} insertCurrentRank={!chartsData.limitEndDate} />

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
          <MiscChart title={`Miscellaneous`} id={"misc_stats"} games={filteredGamesData} player={player} />
        </div>
      )}
    </div>
  );
}
const mapReduxStateToProps = ({ chartsData, games, player }: StoreState) => ({
  chartsData,
  games,
  player,
});

export default connect(mapReduxStateToProps)(ChartList);
