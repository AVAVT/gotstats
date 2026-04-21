import { useMemo } from "react";
import { PlayerState } from "@/redux/player/type";
import { Game } from "@/type/game";
import { isPlayerWin } from "@/utils/chart-utils";
import DonutChart from "../shared/charts/donut-chart";
import { getDonutCharProps } from "./chart-settings";
import { CHART_SIZE, CHART_THEME } from "./settings";

const mainChartSettings = getDonutCharProps(CHART_THEME.COLORED, CHART_SIZE.HERO);
const subChartSettings = getDonutCharProps(CHART_THEME.WINLOSE, CHART_SIZE.DEFAULT);

export interface BoardSizesChartProps {
  title: string;
  id: string;
  games: Game[];
  player: PlayerState;
}

function computeBoardSizes(games: Game[], playerId: number) {
  var nineteenGames = 0,
    thirteenGames = 0,
    nineGames = 0,
    otherGames = 0,
    nineteenLosses = 0,
    thirteenLosses = 0,
    nineLosses = 0,
    otherLosses = 0;

  games.forEach((game) => {
    if (game.width === 19 && game.height === 19) {
      nineteenGames++;
      if (!isPlayerWin(game, playerId)) nineteenLosses++;
    } else if (game.width === 13 && game.height === 13) {
      thirteenGames++;
      if (!isPlayerWin(game, playerId)) thirteenLosses++;
    } else if (game.width === 9 && game.height === 9) {
      nineGames++;
      if (!isPlayerWin(game, playerId)) nineLosses++;
    } else {
      otherGames++;
      if (!isPlayerWin(game, playerId)) otherLosses++;
    }
  });

  return {
    nineteenGames,
    thirteenGames,
    nineGames,
    otherGames,
    nineteenLosses,
    thirteenLosses,
    nineLosses,
    otherLosses,
  };
}

export default function BoardSizesChart({ title, id, games, player }: BoardSizesChartProps) {
  const statistics = computeBoardSizes(games, player.id);

  const chartData1 = useMemo(
    () => [
      { label: "19x19", value: statistics.nineteenGames },
      { label: "13x13", value: statistics.thirteenGames },
      { label: "9x9", value: statistics.nineGames },
      { label: "Other", value: statistics.otherGames },
    ],
    [statistics.nineteenGames, statistics.thirteenGames, statistics.nineGames, statistics.otherGames],
  );

  const chartData2 = useMemo(
    () =>
      statistics.nineteenGames > 0
        ? [
            { label: "Wins", value: statistics.nineteenGames - statistics.nineteenLosses },
            { label: "Losses", value: statistics.nineteenLosses },
          ]
        : null,
    [statistics.nineteenGames, statistics.nineteenLosses],
  );

  const chartData3 = useMemo(
    () =>
      statistics.thirteenGames > 0
        ? [
            { label: "Wins", value: statistics.thirteenGames - statistics.thirteenLosses },
            { label: "Losses", value: statistics.thirteenLosses },
          ]
        : null,
    [statistics.thirteenGames, statistics.thirteenLosses],
  );

  const chartData4 = useMemo(
    () =>
      statistics.nineGames > 0
        ? [
            { label: "Wins", value: statistics.nineGames - statistics.nineLosses },
            { label: "Losses", value: statistics.nineLosses },
          ]
        : null,
    [statistics.nineGames, statistics.nineLosses],
  );

  const chartData5 = useMemo(
    () =>
      statistics.otherGames > 0
        ? [
            { label: "Wins", value: statistics.otherGames - statistics.otherLosses },
            { label: "Losses", value: statistics.otherLosses },
          ]
        : null,
    [statistics.otherGames, statistics.otherLosses],
  );

  return (
    <section className="stats_block">
      <h2 id={id} className="text-center">
        {title}
      </h2>
      <div>
        {chartData1 ? (
          <div className="mx-auto">
            <DonutChart data={chartData1} {...mainChartSettings} />
          </div>
        ) : null}
      </div>
      <h3 className="text-center">Win/Loss ratio</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chartData2 ? (
          <div>
            <h5 className="text-center">19x19</h5>
            <DonutChart data={chartData2} {...subChartSettings} />
          </div>
        ) : null}
        {chartData3 ? (
          <div>
            <h5 className="text-center">13x13</h5>
            <DonutChart data={chartData3} {...subChartSettings} />
          </div>
        ) : null}
        {chartData4 ? (
          <div>
            <h5 className="text-center">9x9</h5>
            <DonutChart data={chartData4} {...subChartSettings} />
          </div>
        ) : null}
        {chartData5 ? (
          <div>
            <h5 className="text-center">Other Sizes</h5>
            <DonutChart data={chartData5} {...subChartSettings} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
