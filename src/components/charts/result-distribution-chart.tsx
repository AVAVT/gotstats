import { Chart } from "react-google-charts";
import { PlayerState } from "@/redux/player/type";
import { Game } from "@/type/game";
import { isPlayerWin } from "@/utils/chart-utils";

export interface ResultDistributionChartProps {
  title: string;
  id: string;
  games: Game[];
  player: PlayerState;
}

const pieChartOptions = {
  backgroundColor: "transparent",
  chartArea: { top: 10, left: 0, right: 0 },
  colors: ["#d93344", "#CEEC97", "#6369D1", "#D8D2E1"],
  pieSliceTextStyle: { color: "#ffffff" },
  legend: {
    position: "bottom",
    textStyle: {
      color: "#f8f8ff",
      fontName: "Roboto",
      fontSize: 14,
    },
  },
};

const columnChartOptions = {
  backgroundColor: "transparent",
  isStacked: true,
  chartArea: { top: 10 },
  colors: ["#d93344", "#CEEC97", "#6369D1", "#D8D2E1"],
  legend: {
    maxLines: 2,
    position: "bottom",
    textStyle: {
      color: "#f8f8ff",
      fontName: "Roboto",
      fontSize: 14,
    },
  },
  hAxis: {
    textStyle: { color: "#f8f8ff", fontName: "Roboto", fontSize: 11 },
  },
  vAxis: {
    textStyle: { color: "#f8f8ff", fontName: "Roboto", fontSize: 11 },
  },
};

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

function generateChartData(games: Game[], playerId: number) {
  const distributions = computeWinLoseDistributions(games, playerId);

  return {
    chartData1: [
      ["Result", "Games"],
      ["Timeout", distributions["Plr+Time"]],
      ["Resign", distributions["Plr+Res"]],
      ["Scoring", distributions["Plr+Count"]],
      ["Other", distributions["Plr+Other"]],
    ],
    chartData2: [
      ["Result", "Games"],
      ["Timeout", distributions["Opp+Time"]],
      ["Resign", distributions["Opp+Res"]],
      ["Scoring", distributions["Opp+Count"]],
      ["Other", distributions["Opp+Other"]],
    ],
    chartData3: [
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
    ],
  };
}

export default function ResultDistributionChart({ title, id, games, player }: ResultDistributionChartProps) {
  const { chartData1, chartData2, chartData3 } = generateChartData(games, player.id);

  return (
    <section className="stats_block">
      <h2 id={id} className="text-center">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chartData2 ? (
          <div>
            <h5 className="text-center">Losses</h5>
            <Chart chartType="PieChart" options={pieChartOptions} data={chartData2} width={"100%"} height={"300px"} />
          </div>
        ) : null}
        {chartData1 ? (
          <div>
            <h5 className="text-center">Wins</h5>
            <Chart chartType="PieChart" options={pieChartOptions} data={chartData1} width={"100%"} height={"300px"} />
          </div>
        ) : null}
      </div>
      <div>
        {chartData3 ? (
          <div>
            <h3 className="text-center">Final scoring distribution</h3>
            <Chart
              chartType="ColumnChart"
              options={columnChartOptions}
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
