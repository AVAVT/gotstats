import React, { Component } from "react";
import PropTypes from "prop-types";
import { Chart } from "react-google-charts";

import { isPlayerWin } from "../../Shared/utils";

class ResultDistributionChart extends Component {
  static propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    games: PropTypes.array.isRequired,
    player: PropTypes.object.isRequired,
  };

  state = {
    pieChartOptions: {
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
    },
    columnChartOptions: {
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
    },
  };

  assignGameResultToDistributions = (distributions, game) => {
    const isWin = isPlayerWin(game, distributions.id);

    if (game.outcome === "Resignation") {
      distributions[`${isWin ? "Plr" : "Opp"}+Res`]++;
    } else if (game.outcome === "Timeout") {
      distributions[`${isWin ? "Plr" : "Opp"}+Time`]++;
    } else if (!isNaN(game.outcome.split(" ")[0])) {
      const points = parseFloat(game.outcome.split(" ")[0], 10);
      const pointDiff = Math.floor(points / 10);

      var result = (pointDiff < 4 ? pointDiff : 4) * 10 + "+";
      result = `${isWin ? "Plr" : "Opp"}+${result}`;

      distributions[`${isWin ? "Plr" : "Opp"}+Count`]++;
      distributions[result]++;
    } else {
      distributions[`${isWin ? "Plr" : "Opp"}+Other`]++;
    }

    return distributions;
  };

  computeWinLoseDistributions = (games, playerId) => {
    var distributions = {
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

    return games.reduce(this.assignGameResultToDistributions, distributions);
  };

  generateChartData(games, playerId) {
    const distributions = this.computeWinLoseDistributions(games, playerId);

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

  render() {
    const { games, player } = this.props;

    const { chartData1, chartData2, chartData3 } = this.generateChartData(
      games,
      player.id
    );

    return (
      <section className="stats_block">
        <h2 id={this.props.id} className="text-center">
          {this.props.title}
        </h2>
        <div className="row">
          {chartData2 ? (
            <div className="col-md-6">
              <h5 className="text-center">Losses</h5>
              <Chart
                chartType="PieChart"
                options={this.state.pieChartOptions}
                data={chartData2}
                width={"100%"}
                height={"300px"}
              />
            </div>
          ) : null}
          {chartData1 ? (
            <div className="col-md-6">
              <h5 className="text-center">Wins</h5>
              <Chart
                chartType="PieChart"
                options={this.state.pieChartOptions}
                data={chartData1}
                width={"100%"}
                height={"300px"}
              />
            </div>
          ) : null}
        </div>
        <div className="row">
          {chartData3 ? (
            <div className="col-12">
              <h3 className="text-center">Final scoring distribution</h3>
              <Chart
                chartType="ColumnChart"
                options={this.state.columnChartOptions}
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
}

export default ResultDistributionChart;
