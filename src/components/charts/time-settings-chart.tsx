import { useMemo } from "react";
import { PlayerState } from "@/redux/player/type";
import { Game } from "@/type/game";
import { isPlayerWin } from "@/utils/chart-utils";
import DonutChart from "../shared/charts/donut-chart";
import { getDonutCharProps } from "./chart-settings";
import { CHART_SIZE, CHART_THEME } from "./settings";

const mainChartSettings = getDonutCharProps(CHART_THEME.COLORED, CHART_SIZE.HERO);
const subChartSettings = getDonutCharProps(CHART_THEME.WINLOSE, CHART_SIZE.DEFAULT);

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

export default function TimeSettingsChart({ title, id, games, player }: TimeSettingsChartProps) {
  const statistics = computeTimeSettings(games, player.id);

  const chartData1 = useMemo(
    () => [
      { label: "Blitz", value: statistics.blitzGames },
      { label: "Live", value: statistics.liveGames },
      { label: "Correspondence", value: statistics.correspondenceGames },
    ],
    [statistics.blitzGames, statistics.liveGames, statistics.correspondenceGames],
  );

  const chartData2 = useMemo(
    () =>
      statistics.blitzGames > 0
        ? [
            { label: "Wins", value: statistics.blitzGames - statistics.blitzLosses },
            { label: "Losses", value: statistics.blitzLosses },
          ]
        : null,
    [statistics.blitzGames, statistics.blitzLosses],
  );

  const chartData3 = useMemo(
    () =>
      statistics.liveGames > 0
        ? [
            { label: "Wins", value: statistics.liveGames - statistics.liveLosses },
            { label: "Losses", value: statistics.liveLosses },
          ]
        : null,
    [statistics.liveGames, statistics.liveLosses],
  );

  const chartData4 = useMemo(
    () =>
      statistics.correspondenceGames > 0
        ? [
            { label: "Wins", value: statistics.correspondenceGames - statistics.correspondenceLosses },
            { label: "Losses", value: statistics.correspondenceLosses },
          ]
        : null,
    [statistics.correspondenceGames, statistics.correspondenceLosses],
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chartData2 ? (
          <div>
            <h5 className="text-center">Blitz</h5>
            <DonutChart data={chartData2} {...subChartSettings} />
          </div>
        ) : null}
        {chartData3 ? (
          <div>
            <h5 className="text-center">Live</h5>
            <DonutChart data={chartData3} {...subChartSettings} />
          </div>
        ) : null}
        {chartData4 ? (
          <div>
            <h5 className="text-center">Correspondence</h5>
            <DonutChart data={chartData4} {...subChartSettings} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
