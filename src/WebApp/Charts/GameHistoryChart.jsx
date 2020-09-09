import React, { Component } from "react";
import PropTypes from "prop-types";
import Chart from "react-google-charts";

import configs from "../../OGSApi/configs.json";
import {
  ratingToKyuDan,
  getPlayerRating,
  isPlayerWin,
  extractHistoricalPlayerAndOpponent,
} from "../../Shared/utils";

import moment from "moment";

class GameHistoryChart extends Component {
  static propTypes = {
    games: PropTypes.array.isRequired,
    player: PropTypes.object.isRequired,
    insertCurrentRank: PropTypes.bool.isRequired,
  };

  state = {
    scatterPlotChartOptions: {
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
    },
  };

  computeGameHistory = (games, player, insertCurrentRank) => {
    let historicalWinloss = [];

    if (insertCurrentRank || games.length < 2) {
      historicalWinloss.push({
        date: new Date(),
        playerRating: getPlayerRating(player),
      });
    }

    for (const game of games) {
      const isWin = isPlayerWin(game, player.id);
      const {
        historicalPlayer,
        historicalOpponent,
      } = extractHistoricalPlayerAndOpponent(game, player.id);
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
  };

  renderChartTooltip = ({
    isBlack,
    isWin,
    date,
    playerRating,
    opponentRating,
    gameId,
  }) =>
    opponentRating
      ? `<h6><a class="${isWin ? "text-green" : "text-red"}" href="${
          configs.OGS_ROOT
        }game/${gameId}" target="blank" rel="noopener noreferrer nofollow">${moment(
          date
        ).format("MMM D, YYYY HH:mm")} - ${isWin ? "Win" : "Loss"}</a></h6>
      <div><i class="fas fa-circle" style="${
        isBlack ? "color: #000000;" : "color: #ffffff;"
      }"></i> Player rating: ${Math.round(playerRating)} (${ratingToKyuDan(
          playerRating
        )})</div>
      <div><i class="fas fa-circle" style="${
        isBlack ? "color: #ffffff;" : "color: #000000;"
      }"></i> Opponent rating: ${Math.round(opponentRating)} (${ratingToKyuDan(
          opponentRating
        )})</div>`
      : `<h6>Currently</h6>
      <div>Player rating: ${Math.round(playerRating)} (${ratingToKyuDan(
          playerRating
        )})</div>`;

  render() {
    const { games, player, insertCurrentRank } = this.props;

    const historicalWinloss = this.computeGameHistory(
      games,
      player,
      insertCurrentRank
    );

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
        this.renderChartTooltip(item),
        item.isWin ? null : item.opponentRating,
        this.renderChartTooltip(item),
        item.isWin ? item.opponentRating : null,
        this.renderChartTooltip(item),
      ]),
    ];

    return (
      <Chart
        chartType="ComboChart"
        data={chartData}
        options={this.state.scatterPlotChartOptions}
        width={"100%"}
        height={"400px"}
      />
    );
  }
}

export default GameHistoryChart;
