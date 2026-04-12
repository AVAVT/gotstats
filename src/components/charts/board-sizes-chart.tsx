import { Chart } from "react-google-charts";
import { PlayerState } from "@/redux/player/type";
import { Game } from "@/type/game";
import { isPlayerWin } from "@/utils/chart-utils";

export interface BoardSizesChartProps {
  title: string;
  id: string;
  games: Game[];
  player: PlayerState;
}

const mainChartOptions = {
  backgroundColor: "transparent",
  chartArea: {
    top: 60,
    left: 0,
    right: 0,
  },
  colors: ["#d93344", "#CEEC97", "#6369D1", "#D8D2E1"],
  pieSliceTextStyle: { color: "#ffffff" },
  legend: {
    maxLines: 2,
    position: "bottom",
    alignment: "center",
    textStyle: {
      color: "#f8f8ff",
      fontName: "Roboto",
      fontSize: 14,
    },
  },
};

const pieChartOptions = {
  backgroundColor: "transparent",
  chartArea: { top: 10 },
  colors: ["#d93344", "#CEEC97", "#6369D1", "#D8D2E1"],
  pieSliceTextStyle: { color: "#ffffff" },
  legend: {
    maxLines: 2,
    position: "bottom",
    textStyle: {
      color: "#f8f8ff",
      fontName: "Roboto",
      fontSize: 14,
    },
  },
};

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

function generateChartData(games: Game[], playerId: number) {
  const {
    nineteenGames,
    thirteenGames,
    nineGames,
    otherGames,
    nineteenLosses,
    thirteenLosses,
    nineLosses,
    otherLosses,
  } = computeBoardSizes(games, playerId);

  return {
    chartData1: [
      ["Size", "Games"],
      ["19x19", nineteenGames],
      ["13x13", thirteenGames],
      ["9x9", nineGames],
      ["Other", otherGames],
    ],
    chartData2:
      nineteenGames > 0
        ? [
            ["Result", "Games"],
            ["Losses", nineteenLosses],
            ["Wins", nineteenGames - nineteenLosses],
          ]
        : null,
    chartData3:
      thirteenGames > 0
        ? [
            ["Result", "Games"],
            ["Losses", thirteenLosses],
            ["Wins", thirteenGames - thirteenLosses],
          ]
        : null,
    chartData4:
      nineGames > 0
        ? [
            ["Result", "Games"],
            ["Losses", nineLosses],
            ["Wins", nineGames - nineLosses],
          ]
        : null,
    chartData5:
      otherGames > 0
        ? [
            ["Result", "Games"],
            ["Losses", otherLosses],
            ["Wins", otherGames - otherLosses],
          ]
        : null,
  };
}

export default function BoardSizesChart({ title, id, games, player }: BoardSizesChartProps) {
  const { chartData1, chartData2, chartData3, chartData4, chartData5 } = generateChartData(games, player.id);

  return (
    <section className="stats_block">
      <h2 id={id} className="text-center">
        {title}
      </h2>
      <div>
        {chartData1 ? (
          <div className="mx-auto">
            <Chart chartType="PieChart" options={mainChartOptions} data={chartData1} width={"100%"} height={"400px"} />
          </div>
        ) : null}
      </div>
      <h3 className="text-center">Win/Loss ratio</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chartData2 ? (
          <div>
            <h5 className="text-center">19x19</h5>
            <Chart chartType="PieChart" options={pieChartOptions} data={chartData2} width={"100%"} height={"250px"} />
          </div>
        ) : null}
        {chartData3 ? (
          <div>
            <h5 className="text-center">13x13</h5>
            <Chart chartType="PieChart" options={pieChartOptions} data={chartData3} width={"100%"} height={"250px"} />
          </div>
        ) : null}
        {chartData4 ? (
          <div>
            <h5 className="text-center">9x9</h5>
            <Chart chartType="PieChart" options={pieChartOptions} data={chartData4} width={"100%"} height={"250px"} />
          </div>
        ) : null}
        {chartData5 ? (
          <div>
            <h5 className="text-center">Other Sizes</h5>
            <Chart chartType="PieChart" options={pieChartOptions} data={chartData5} width={"100%"} height={"250px"} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
