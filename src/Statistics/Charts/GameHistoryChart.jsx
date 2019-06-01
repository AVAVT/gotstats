import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-google-charts';

import configs from '../../OGSApi/configs.json';
import Analyzer from '../../Data/Analyzer';
import { ratingToKyuDan } from "../../Data/utils";

import moment from "moment";

class GameHistoryChart extends Component {
  static propTypes = {
    gamesData: PropTypes.shape({
      playerId: PropTypes.number.isRequired,
      games: PropTypes.array.isRequired
    }).isRequired,
    player: PropTypes.object.isRequired
  }

  state = {
    scatterPlotChartOptions: {
      backgroundColor: "transparent",
      chartArea: { top: 50, left: 50, right: 5 },
      colors: ["#5486d1", "#d93344", "#41CD64", "#9d4dc5"],
      legend: {
        position: "bottom",
        textStyle: {
          color: "#f8f8ff",
          fontName: "Roboto",
          fontSize: 14
        }
      },
      series: [
        { type: 'line' },
        { type: 'scatter', pointShape: { type: 'triangle', rotation: 180 } },
        { type: 'scatter', pointShape: { type: 'triangle' } }
      ],
      hAxis: {
        textStyle: { color: "#f8f8ff", fontName: "Roboto", fontSize: 11 }, gridlines: {
          color: 'transparent', count: 2
        }, format: 'MMM yy'
      },
      vAxis: { textStyle: { color: "#f8f8ff", fontName: "Roboto", fontSize: 11 }, gridlines: { count: 0 } },
      tooltip: {
        isHtml: true, trigger: 'selection'
      },
      focusTarget: 'category'
    }
  }

  renderChartTooltip = (isWin, date, playerRating, opponentRating, gameId) => opponentRating
    ? `<h6><a href="${configs.OGS_ROOT}game/${gameId}" target="blank" rel="noopener noreferrer nofollow">${moment(date).format("MMM D, YYYY HH:mm")}</a></h6>
      <div class="${isWin ? 'text-green' : 'text-red'}">${isWin ? 'Win' : 'Loss'}</div>
      <div>Player rating: ${Math.round(playerRating)} (${ratingToKyuDan(playerRating)})</div>
      <div>Opponent rating: ${Math.round(opponentRating)} (${ratingToKyuDan(opponentRating)})</div>`
    : `<h6>Currently</h6>
      <div>Player rating: ${Math.round(playerRating)} (${ratingToKyuDan(playerRating)})</div>`

  render() {
    const historicalWinloss = Analyzer.computeGameHistory(this.props.gamesData.games, this.props.player);

    const chartData = [
      [
        'Date',
        { 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } },
        { type: 'number', label: 'Player Rating' },
        { type: 'number', label: 'Opponent Rating (Loss)' },
        { type: 'number', label: 'Opponent Rating (Win)' },
      ],
      ...(
        historicalWinloss.map(
          item => [
            item.date,
            this.renderChartTooltip(item.isWin, item.date, item.playerRating, item.opponentRating, item.gameId),
            item.playerRating,
            item.isWin ? null : item.opponentRating,
            item.isWin ? item.opponentRating : null
          ]
        )
      )
    ]

    return (<Chart
      chartType="ComboChart"
      data={chartData}
      options={this.state.scatterPlotChartOptions}
      width={'100%'}
      height={'400px'}
    />
    );
  }
}

export default GameHistoryChart;
