import { format } from "date-fns";
import { Chart } from "react-google-charts";
import { OGS_ROOT } from "@/api/api-constants";
import { PlayerState } from "@/redux/player/type";
import { Game } from "@/type/game";
import { extractHistoricalPlayerAndOpponent, getPlayerRating, isPlayerWin, ratingToKyuDan } from "@/utils/chart-utils";
import { chartColor1, chartColor2, chartColor3 } from "@/utils/color-utils";
import getChartSettings, { CHART_THEME, CHART_TYPE } from "./settings";

export interface GameHistoryChartProps {
  games: Game[];
  player: PlayerState;
  insertCurrentRank: boolean;
}

const scatterPlotChartOptions = {
  ...getChartSettings(CHART_TYPE.SCATTERPLOT, CHART_THEME.MONOCHROME),
  colors: [chartColor3, chartColor1, chartColor2],
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
      playerRating: getPlayerRating(player),
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
    ? `<h6><a class="${isWin ? "text-green" : "text-red"}" href="${OGS_ROOT}game/${gameId}" target="blank" rel="noopener noreferrer nofollow">${format(date, "MMM d, yyyy HH:mm")} - ${isWin ? "Win" : "Loss"}</a></h6>
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
