import { ReactNode, useMemo } from "react";
import { PlayerState } from "@/redux/player/type";
import { Game } from "@/type/game";
import DonutChart from "../shared/charts/donut-chart";
import { getDonutCharProps } from "./chart-settings";
import { CHART_SIZE, CHART_THEME } from "./settings";

const mainChartSettings = getDonutCharProps(CHART_THEME.MONOCHROME, CHART_SIZE.HERO);
const subChartSettings = getDonutCharProps(CHART_THEME.WINLOSE, CHART_SIZE.DEFAULT);

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

  const chartData1 = useMemo(
    () => [
      { label: "Black", value: statistics.blackGames },
      { label: "White", value: statistics.whiteGames },
    ],
    [statistics.blackGames, statistics.whiteGames],
  );

  const chartData2 = useMemo(
    () => [
      {
        label: "Wins",
        value: statistics.blackGames + statistics.whiteGames - (statistics.blackLosses + statistics.whiteLosses),
      },
      { label: "Losses", value: statistics.blackLosses + statistics.whiteLosses },
    ],
    [statistics.blackGames, statistics.whiteGames, statistics.blackLosses, statistics.whiteLosses],
  );

  const chartData3 = useMemo(
    () => [
      { label: "Wins", value: statistics.blackGames - statistics.blackLosses },
      { label: "Losses", value: statistics.blackLosses },
    ],
    [statistics.blackGames, statistics.blackLosses],
  );

  const chartData4 = useMemo(
    () => [
      { label: "Wins", value: statistics.whiteGames - statistics.whiteLosses },
      { label: "Losses", value: statistics.whiteLosses },
    ],
    [statistics.whiteGames, statistics.whiteLosses],
  );

  return (
    <section className="stats_block">
      <h2 id={id} className="text-center">
        {title}
      </h2>
      <div className="row">
        {chartData1 ? (
          <div className="mx-auto">
            <DonutChart data={chartData1} {...mainChartSettings} />
          </div>
        ) : null}
      </div>
      <h3 className="text-center">Win/Loss ratio</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chartData2 ? (
          <div>
            <h5 className="text-center mb-2">Total</h5>
            <DonutChart data={chartData2} {...subChartSettings} />
          </div>
        ) : null}
        {chartData3 ? (
          <div>
            <h5 className="text-center mb-2">As Black</h5>
            <DonutChart data={chartData3} {...subChartSettings} />
          </div>
        ) : null}
        {chartData4 ? (
          <div>
            <h5 className="text-center mb-2">As White</h5>
            <DonutChart data={chartData4} {...subChartSettings} />
          </div>
        ) : null}
      </div>
      {footer}
    </section>
  );
}
