import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-google-charts';

import Analyzer from '../../Data/Analyzer';
import { connect } from "react-redux";

class WinLoseChart extends Component {
  static propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    gamesData: PropTypes.shape({
      playerId: PropTypes.number.isRequired,
      games: PropTypes.array.isRequired,
    }).isRequired,
    footer: PropTypes.element
  }

  state = {
    mainChartOptions: {
      backgroundColor: "transparent",
      chartArea: { top: 30 },
      colors: ["#000000", "#f8f8ff"],
      pieSliceTextStyle: { color: "#d93344" },
      legend: {
        position: "bottom",
        textStyle: {
          color: "#f8f8ff",
          fontName: "Roboto",
          fontSize: 14
        }
      }
    },
    subChartOptions: {
      backgroundColor: "transparent",
      chartArea: { top: 10 },
      colors: ["#d93344", "#41CD64", "#5486d1", "#9d4dc5"],
      pieSliceTextStyle: { color: "#ffffff" },
      legend: {
        maxLines: 2,
        position: "bottom",
        textStyle: {
          color: "#f8f8ff",
          fontName: "Roboto",
          fontSize: 14
        }
      }
    }
  }

  render() {
    const statistics = Analyzer.computeWinLoseStatistics(this.props.gamesData.games, this.props.gamesData.playerId);
    const chartData1 = [
      ['Color', 'Games'],
      ['Black', statistics.blackGames],
      ['White', statistics.whiteGames],
    ];
    const chartData2 = [
      ['Result', 'Games'],
      ['Losses', (statistics.blackLosses + statistics.whiteLosses)],
      ['Wins', (statistics.blackGames + statistics.whiteGames) - (statistics.blackLosses + statistics.whiteLosses)],
    ];
    const chartData3 = statistics.blackGames > 0 ? [
      ['Result', 'Games'],
      ['Losses', statistics.blackLosses],
      ['Wins', statistics.blackGames - statistics.blackLosses],
    ] : null;
    const chartData4 = statistics.whiteGames > 0 ? [
      ['Result', 'Games'],
      ['Losses', statistics.whiteLosses],
      ['Wins', statistics.whiteGames - statistics.whiteLosses],
    ] : null;

    return (
      <section className="stats_block">
        <h2 id={this.props.id} className="text-center">{this.props.title}</h2>
        <div className="row">
          {
            chartData1 ? (
              <div className="col-sm-6 mr-auto ml-auto">
                <Chart
                  chartType="PieChart"
                  options={this.state.mainChartOptions}
                  data={chartData1}
                  width={'100%'}
                  height={'300px'}
                />
              </div>
            ) : null
          }
        </div>
        <h3 className="text-center">Win/Loss ratio</h3>
        <div className="row">
          {
            chartData2 ? (
              <div className="col-md-4">
                <h5 className="text-center">Total</h5>
                <Chart
                  chartType="PieChart"
                  options={this.state.subChartOptions}
                  data={chartData2}
                  width={'100%'}
                  height={'250px'}
                />
              </div>
            ) : null
          }
          {
            chartData3 ? (
              <div className="col-md-4">
                <h5 className="text-center">As Black</h5>
                <Chart
                  chartType="PieChart"
                  options={this.state.subChartOptions}
                  data={chartData3}
                  width={'100%'}
                  height={'250px'}
                />
              </div>
            ) : null
          }
          {
            chartData4 ? (
              <div className="col-md-4">
                <h5 className="text-center">As White</h5>
                <Chart
                  chartType="PieChart"
                  options={this.state.subChartOptions}
                  data={chartData4}
                  width={'100%'}
                  height={'250px'}
                />
              </div>
            ) : null
          }
        </div>
        {this.props.footer}
      </section>
    );
  }
}

const mapReduxStateToProps = ({ player, chartsData }) => ({
  playerId: player.id,
  games: chartsData
})

export default connect(mapReduxStateToProps)(WinLoseChart);
