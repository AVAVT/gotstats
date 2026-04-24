import { useMemo } from "react";
import { Chart } from "react-google-charts";
import { PlayerState } from "@/redux/player/type";
import { Game } from "@/type/game";
import { isPlayerWin } from "@/utils/chart-utils";
import { chartColor1, chartColor2 } from "@/utils/color-utils";
import DonutChart from "../shared/charts/donut-chart";
import { getDonutCharProps } from "./chart-settings";
import getChartSettings, { CHART_SIZE, CHART_THEME, CHART_TYPE } from "./settings";

const pieChartSettings = getDonutCharProps(CHART_THEME.COLORED, CHART_SIZE.DEFAULT);
const columnChartSettings = {
  ...getChartSettings(CHART_TYPE.COLUMN, CHART_THEME.COLORED, CHART_SIZE.DEFAULT),
  colors: [chartColor1, chartColor2],
};

export interface ResultDistributionChartProps {
  title: string;
  id: string;
  games: Game[];
  player: PlayerState;
}

interface Distributions {
  id: number;
  [key: string]: number;
}

function assignGameResultToDistributions(distributions: Distributions, game: Game) {
  const isWin = isPlayerWin(game, distributions.id);

  if (game.outcome === "Resignation") {
    distributions[`${isWin ? "Plr" : "Opp"}+Res`]++;
  } else if (game.outcome === "Timeout") {
    distributions[`${isWin ? "Plr" : "Opp"}+Time`]++;
  } else if (game.outcome && !Number.isNaN(Number(game.outcome.split(" ")[0]))) {
    const points = parseFloat(game.outcome.split(" ")[0]);
    const pointDiff = Math.floor(points / 10);

    const result = `${pointDiff < 4 ? pointDiff : 4}0+`;
    const resultKey = `${isWin ? "Plr" : "Opp"}+${result}`;

    distributions[`${isWin ? "Plr" : "Opp"}+Count`]++;
    distributions[resultKey]++;
  } else {
    distributions[`${isWin ? "Plr" : "Opp"}+Other`]++;
  }

  return distributions;
}

function computeWinLoseDistributions(games: Game[], playerId: number) {
  const distributions: Distributions = {
    id: playerId,
    "Opp+Other": 0,
    "Opp+Count": 0,
    "Opp+Time": 0,
    "Opp+Res": 0,
    "Opp+40+": 0,
    "Opp+30+": 0,
    "Opp+20+": 0,
    "Opp+10+": 0,
    "Opp+0+": 0,
    "Plr+0+": 0,
    "Plr+10+": 0,
    "Plr+20+": 0,
    "Plr+30+": 0,
    "Plr+40+": 0,
    "Plr+Res": 0,
    "Plr+Time": 0,
    "Plr+Count": 0,
    "Plr+Other": 0,
  };

  return games.reduce(assignGameResultToDistributions, distributions);
}

export default function ResultDistributionChart({ title, id, games, player }: ResultDistributionChartProps) {
  const distributions = useMemo(() => computeWinLoseDistributions(games, player.id), [games, player.id]);

  const chartData1 = useMemo(
    () => [
      { label: "Timeout", value: distributions["Plr+Time"] },
      { label: "Resign", value: distributions["Plr+Res"] },
      { label: "Scoring", value: distributions["Plr+Count"] },
      { label: "Other", value: distributions["Plr+Other"] },
    ],
    [distributions["Plr+Time"], distributions["Plr+Res"], distributions["Plr+Count"], distributions["Plr+Other"]],
  );

  const chartData2 = useMemo(
    () => [
      { label: "Timeout", value: distributions["Opp+Time"] },
      { label: "Resign", value: distributions["Opp+Res"] },
      { label: "Scoring", value: distributions["Opp+Count"] },
      { label: "Other", value: distributions["Opp+Other"] },
    ],
    [distributions["Opp+Time"], distributions["Opp+Res"], distributions["Opp+Count"], distributions["Opp+Other"]],
  );

  const chartData3 = [
    ["Outcome", "Losses", `Wins`],
    ["40+", distributions["Opp+40+"], null],
    ["30+", distributions["Opp+30+"], null],
    ["20+", distributions["Opp+20+"], null],
    ["10+", distributions["Opp+10+"], null],
    ["0+", distributions["Opp+0+"], null],
    ["0+", null, distributions["Plr+0+"]],
    ["10+", null, distributions["Plr+10+"]],
    ["20+", null, distributions["Plr+20+"]],
    ["30+", null, distributions["Plr+30+"]],
    ["40+", null, distributions["Plr+40+"]],
  ];

  return (
    <section className="stats_block">
      <h2 id={id} className="text-center">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chartData2 ? (
          <div>
            <h5 className="text-center">Losses</h5>
            <DonutChart data={chartData2} {...pieChartSettings} />
          </div>
        ) : null}
        {chartData1 ? (
          <div>
            <h5 className="text-center">Wins</h5>
            <DonutChart data={chartData1} {...pieChartSettings} />
          </div>
        ) : null}
      </div>
      <div>
        {chartData3 ? (
          <div>
            <h3 className="text-center">Final scoring distribution</h3>
            <Chart
              chartType="ColumnChart"
              options={columnChartSettings}
              data={chartData3}
              width={"100%"}
              height={"300px"}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
