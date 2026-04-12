import moment from "moment";
import { Chart } from "react-google-charts";
import { OGS_ROOT } from "@/api/api-constants";
import { PlayerState } from "@/redux/player/type";
import { Game } from "@/type/game";
import { extractHistoricalPlayerAndOpponent, getPlayerRating, isPlayerWin, ratingToKyuDan } from "@/utils/chart-utils";

export interface GameHistoryChartProps {
  games: Game[];
  player: PlayerState;
  insertCurrentRank: boolean;
}

const scatterPlotChartOptions = {
  backgroundColor: "transparent",
  chartArea: { top: 50, left: 50, right: 5 },
  colors: ["#6369D1", "#d93344", "#CEEC97", "#D8D2E1"],
  legend: {
    position: "bottom",
    textStyle: {
      color: "#f8f8ff",
      fontName: "Roboto",
      fontSize: 14,
    },
  },
  series: [
    { type: "line" },
    { type: "scatter", pointShape: { type: "triangle", rotation: 180 } },
    { type: "scatter", pointShape: { type: "triangle" } },
  ],
  hAxis: {
    textStyle: { color: "#f8f8ff", fontName: "Roboto", fontSize: 11 },
    gridlines: {
      color: "transparent",
    },
    format: "MMM ''yy",
  },
  vAxis: {
    textStyle: { color: "#f8f8ff", fontName: "Roboto", fontSize: 11 },
    gridlines: { count: 0 },
  },
  tooltip: {
    isHtml: true,
    trigger: "selection",
  },
};

interface HistoricalWinLossItem {
  isBlack?: boolean;
  isWin?: boolean;
  date: Date;
  playerRating: number;
  opponentRating?: number;
  gameId?: number;
}

function computeGameHistory(games: Game[], player: PlayerState, insertCurrentRank: boolean): HistoricalWinLossItem[] {
  const historicalWinloss: HistoricalWinLossItem[] = [];

  if (insertCurrentRank || games.length < 2) {
    historicalWinloss.push({
      date: new Date(),
      playerRating: getPlayerRating(player as never),
    });
  }

  for (const game of games) {
    const isWin = isPlayerWin(game, player.id);
    const { historicalPlayer, historicalOpponent } = extractHistoricalPlayerAndOpponent(game, player.id);
    historicalWinloss.push({
      isBlack: game.players.black.id === player.id,
      isWin,
      date: new Date(game.ended),
      playerRating: getPlayerRating(historicalPlayer),
      opponentRating: getPlayerRating(historicalOpponent),
      gameId: game.id,
    });
  }
  return historicalWinloss;
}

function renderChartTooltip({ isBlack, isWin, date, playerRating, opponentRating, gameId }: HistoricalWinLossItem) {
  return opponentRating
    ? `<h6><a class="${isWin ? "text-green" : "text-red"}" href="${OGS_ROOT}game/${gameId}" target="blank" rel="noopener noreferrer nofollow">${moment(date).format("MMM D, YYYY HH:mm")} - ${isWin ? "Win" : "Loss"}</a></h6>
      <div><i class="fas fa-circle" style="${isBlack ? "color: #000000;" : "color: #ffffff;"}"></i> Player rating: ${Math.round(playerRating)} (${ratingToKyuDan(playerRating)})</div>
      <div><i class="fas fa-circle" style="${isBlack ? "color: #ffffff;" : "color: #000000;"}"></i> Opponent rating: ${Math.round(opponentRating)} (${ratingToKyuDan(opponentRating)})</div>`
    : `<h6>Currently</h6>
      <div>Player rating: ${Math.round(playerRating)} (${ratingToKyuDan(playerRating)})</div>`;
}

export default function GameHistoryChart({ games, player, insertCurrentRank }: GameHistoryChartProps) {
  const historicalWinloss = computeGameHistory(games, player, insertCurrentRank);

  const chartData = [
    [
      "Date",
      { type: "number", label: "Player Rating" },
      { type: "string", role: "tooltip", p: { html: true } },
      { type: "number", label: "Opponent Rating (Loss)" },
      { type: "string", role: "tooltip", p: { html: true } },
      { type: "number", label: "Opponent Rating (Win)" },
      { type: "string", role: "tooltip", p: { html: true } },
    ],
    ...historicalWinloss.map((item) => [
      item.date,
      item.playerRating,
      renderChartTooltip(item),
      item.isWin ? null : item.opponentRating,
      renderChartTooltip(item),
      item.isWin ? item.opponentRating : null,
      renderChartTooltip(item),
    ]),
  ];

  return (
    <Chart chartType="ComboChart" data={chartData} options={scatterPlotChartOptions} width={"100%"} height={"400px"} />
  );
}
