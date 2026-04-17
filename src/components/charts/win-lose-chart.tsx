import { ReactNode } from "react";
import { Chart } from "react-google-charts";
import { PlayerState } from "@/redux/player/type";
import { Game } from "@/type/game";
import getChartSettings, { CHART_SIZE, CHART_THEME, CHART_TYPE } from "./settings";

const mainChartSettings = getChartSettings(CHART_TYPE.PIE, CHART_THEME.MONOCHROME, CHART_SIZE.HERO);
const subChartSettings = getChartSettings(CHART_TYPE.PIE, CHART_THEME.COLORED, CHART_SIZE.DEFAULT);

export interface WinLoseChartProps {
  title?: string;
  id?: string;
  games: Game[];
  player: PlayerState;
  footer?: ReactNode;
}

function computeWinLoseStatistics(games: Game[], playerId: number) {
  var blackGames = 0,
    whiteGames = 0,
    blackLosses = 0,
    whiteLosses = 0;
  for (const game of games) {
    if (game.players.black.id === playerId) {
      blackGames++;
      if (game.black_lost) {
        blackLosses++;
      }
    } else {
      whiteGames++;
      if (game.white_lost) {
        whiteLosses++;
      }
    }
  }

  return {
    blackGames,
    blackLosses,
    whiteGames,
    whiteLosses,
  };
}

export default function WinLoseChart({ title, id, games, player, footer }: WinLoseChartProps) {
  const statistics = computeWinLoseStatistics(games, player.id);

  const chartData1 = [
    ["Color", "Games"],
    ["Black", statistics.blackGames],
    ["White", statistics.whiteGames],
  ];
  const chartData2 = [
    ["Result", "Games"],
    ["Losses", statistics.blackLosses + statistics.whiteLosses],
    ["Wins", statistics.blackGames + statistics.whiteGames - (statistics.blackLosses + statistics.whiteLosses)],
  ];
  const chartData3 =
    statistics.blackGames > 0
      ? [
          ["Result", "Games"],
          ["Losses", statistics.blackLosses],
          ["Wins", statistics.blackGames - statistics.blackLosses],
        ]
      : null;
  const chartData4 =
    statistics.whiteGames > 0
      ? [
          ["Result", "Games"],
          ["Losses", statistics.whiteLosses],
          ["Wins", statistics.whiteGames - statistics.whiteLosses],
        ]
      : null;

  return (
    <section className="stats_block">
      <h2 id={id} className="text-center">
        {title}
      </h2>
      <div className="row">
        {chartData1 ? (
          <div className="col-sm-6 mr-auto ml-auto">
            <Chart chartType="PieChart" options={mainChartSettings} data={chartData1} width={"100%"} height={"400px"} />
          </div>
        ) : null}
      </div>
      <h3 className="text-center">Win/Loss ratio</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chartData2 ? (
          <div>
            <h5 className="text-center">Total</h5>
            <Chart chartType="PieChart" options={subChartSettings} data={chartData2} width={"100%"} height={"300px"} />
          </div>
        ) : null}
        {chartData3 ? (
          <div>
            <h5 className="text-center">As Black</h5>
            <Chart chartType="PieChart" options={subChartSettings} data={chartData3} width={"100%"} height={"300px"} />
          </div>
        ) : null}
        {chartData4 ? (
          <div>
            <h5 className="text-center">As White</h5>
            <Chart chartType="PieChart" options={subChartSettings} data={chartData4} width={"100%"} height={"300px"} />
          </div>
        ) : null}
      </div>
      {footer}
    </section>
  );
}
