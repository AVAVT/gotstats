import { Chart } from "react-google-charts";
import { PlayerState } from "@/redux/player/type";
import { Game } from "@/type/game";
import { isPlayerWin } from "@/utils/chart-utils";
import getChartSettings, { CHART_SIZE, CHART_THEME, CHART_TYPE } from "./settings";

const mainChartSettings = getChartSettings(CHART_TYPE.PIE, CHART_THEME.COLORED, CHART_SIZE.HERO);
const subChartSettings = getChartSettings(CHART_TYPE.PIE, CHART_THEME.COLORED, CHART_SIZE.DEFAULT);

export interface TimeSettingsChartProps {
  title: string;
  id: string;
  games: Game[];
  player: PlayerState;
}

function computeTimeSettings(games: Game[], playerId: number) {
  var blitzGames = 0,
    liveGames = 0,
    correspondenceGames = 0,
    blitzLosses = 0,
    liveLosses = 0,
    correspondenceLosses = 0;
  games.forEach((game) => {
    if (game.time_per_move < 20) {
      blitzGames++;
      if (!isPlayerWin(game, playerId)) {
        blitzLosses++;
      }
    } else if (game.time_per_move > 10800) {
      correspondenceGames++;
      if (!isPlayerWin(game, playerId)) {
        correspondenceLosses++;
      }
    } else {
      liveGames++;
      if (!isPlayerWin(game, playerId)) {
        liveLosses++;
      }
    }
  });

  return {
    blitzGames,
    liveGames,
    correspondenceGames,
    blitzLosses,
    liveLosses,
    correspondenceLosses,
  };
}

function generateChartData(games: Game[], playerId: number) {
  const times = computeTimeSettings(games, playerId);

  return {
    chartData1: [
      ["Size", "Games"],
      ["Blitz", times.blitzGames],
      ["Live", times.liveGames],
      ["Correspondence", times.correspondenceGames],
    ],
    chartData2:
      times.blitzGames > 0
        ? [
            ["Result", "Games"],
            ["Losses", times.blitzLosses],
            ["Wins", times.blitzGames - times.blitzLosses],
          ]
        : null,
    chartData3:
      times.liveGames > 0
        ? [
            ["Result", "Games"],
            ["Losses", times.liveLosses],
            ["Wins", times.liveGames - times.liveLosses],
          ]
        : null,
    chartData4:
      times.correspondenceGames > 0
        ? [
            ["Result", "Games"],
            ["Losses", times.correspondenceLosses],
            ["Wins", times.correspondenceGames - times.correspondenceLosses],
          ]
        : null,
  };
}

export default function TimeSettingsChart({ title, id, games, player }: TimeSettingsChartProps) {
  const { chartData1, chartData2, chartData3, chartData4 } = generateChartData(games, player.id);

  return (
    <section className="stats_block">
      <h2 id={id} className="text-center">
        {title}
      </h2>
      <div>
        {chartData1 ? (
          <div className="mx-auto">
            <Chart chartType="PieChart" options={mainChartSettings} data={chartData1} width={"100%"} height={"400px"} />
          </div>
        ) : null}
      </div>
      <h3 className="text-center">Win/Loss ratio</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chartData2 ? (
          <div>
            <h5 className="text-center">Blitz</h5>
            <Chart chartType="PieChart" options={subChartSettings} data={chartData2} width={"100%"} height={"300px"} />
          </div>
        ) : null}
        {chartData3 ? (
          <div>
            <h5 className="text-center">Live</h5>
            <Chart chartType="PieChart" options={subChartSettings} data={chartData3} width={"100%"} height={"300px"} />
          </div>
        ) : null}
        {chartData4 ? (
          <div>
            <h5 className="text-center">Correspondence</h5>
            <Chart chartType="PieChart" options={subChartSettings} data={chartData4} width={"100%"} height={"300px"} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
