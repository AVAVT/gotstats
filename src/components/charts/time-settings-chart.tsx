import { Chart } from "react-google-charts";
import { PlayerState } from "@/redux/player/type";
import { Game } from "@/type/game";
import { isPlayerWin } from "@/utils/chart-utils";

export interface TimeSettingsChartProps {
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
            <Chart chartType="PieChart" options={mainChartOptions} data={chartData1} width={"100%"} height={"400px"} />
          </div>
        ) : null}
      </div>
      <h3 className="text-center">Win/Loss ratio</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chartData2 ? (
          <div>
            <h5 className="text-center">Blitz</h5>
            <Chart chartType="PieChart" options={pieChartOptions} data={chartData2} width={"100%"} height={"250px"} />
          </div>
        ) : null}
        {chartData3 ? (
          <div>
            <h5 className="text-center">Live</h5>
            <Chart chartType="PieChart" options={pieChartOptions} data={chartData3} width={"100%"} height={"250px"} />
          </div>
        ) : null}
        {chartData4 ? (
          <div>
            <h5 className="text-center">Correspondence</h5>
            <Chart chartType="PieChart" options={pieChartOptions} data={chartData4} width={"100%"} height={"250px"} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
