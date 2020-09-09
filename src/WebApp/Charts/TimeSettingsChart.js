import React, { Component } from "react";
import PropTypes from "prop-types";
import { Chart } from "react-google-charts";

import { isPlayerWin } from "../../Shared/utils";

class TimeSettingsChart extends Component {
  static propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    games: PropTypes.array.isRequired,
    player: PropTypes.object.isRequired,
  };

  state = {
    mainChartOptions: {
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
    },
    pieChartOptions: {
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
    },
  };

  computeTimeSettings = (games, playerId) => {
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
  };

  generateChartData(games, playerId) {
    const times = this.computeTimeSettings(games, playerId);

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

  render() {
    const { games, player } = this.props;
    const {
      chartData1,
      chartData2,
      chartData3,
      chartData4,
    } = this.generateChartData(games, player.id);

    return (
      <section className="stats_block">
        <h2 id={this.props.id} className="text-center">
          {this.props.title}
        </h2>
        <div className="row">
          {chartData1 ? (
            <div className="col-sm-6 mr-auto ml-auto">
              <Chart
                chartType="PieChart"
                options={this.state.mainChartOptions}
                data={chartData1}
                width={"100%"}
                height={"400px"}
              />
            </div>
          ) : null}
        </div>
        <h3 className="text-center">Win/Loss ratio</h3>
        <div className="row">
          {chartData2 ? (
            <div className="col-md-4">
              <h5 className="text-center">Blitz</h5>
              <Chart
                chartType="PieChart"
                options={this.state.pieChartOptions}
                data={chartData2}
                width={"100%"}
                height={"250px"}
              />
            </div>
          ) : null}
          {chartData3 ? (
            <div className="col-md-4">
              <h5 className="text-center">Live</h5>
              <Chart
                chartType="PieChart"
                options={this.state.pieChartOptions}
                data={chartData3}
                width={"100%"}
                height={"250px"}
              />
            </div>
          ) : null}
          {chartData4 ? (
            <div className="col-md-4">
              <h5 className="text-center">Correspondence</h5>
              <Chart
                chartType="PieChart"
                options={this.state.pieChartOptions}
                data={chartData4}
                width={"100%"}
                height={"250px"}
              />
            </div>
          ) : null}
        </div>
      </section>
    );
  }
}

export default TimeSettingsChart;
