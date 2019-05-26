import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-google-charts';

import Analyzer from '../../Data/Analyzer';

class TimeSettingsChart extends Component {
  static propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    gamesData: PropTypes.shape({
      playerId: PropTypes.number.isRequired,
      games: PropTypes.array.isRequired
    }).isRequired
  }

  state = {
    mainChartOptions: {
      backgroundColor: "transparent",
      chartArea: { top: 30 },
      colors: ["#d93344", "#41CD64", "#5486d1", "#9d4dc5"],
      pieSliceTextStyle: { color: "#ffffff" },
      legend: {
        maxLines: 2,
        position: "bottom",
        textStyle: {
          color: "#f8f8ff",
          fontName: "Helvetica Neue",
          fontSize: 14
        }
      }
    },
    pieChartOptions: {
      backgroundColor: "transparent",
      chartArea: { top: 10 },
      colors: ["#d93344", "#41CD64", "#5486d1", "#9d4dc5"],
      pieSliceTextStyle: { color: "#ffffff" },
      legend: {
        maxLines: 2,
        position: "bottom",
        textStyle: {
          color: "#f8f8ff",
          fontName: "Helvetica Neue",
          fontSize: 14
        }
      }
    }
  }

  componentDidMount() {
    this.generateChartData(this.props.gamesData);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.gamesData !== this.props.gamesData) {
      this.generateChartData(nextProps.gamesData);
    }
  }

  generateChartData(gamesData) {
    const times = Analyzer.computeTimeSettings(gamesData.games, gamesData.playerId);

    this.setState({
      chartData1: [
        ['Size', 'Games'],
        ['Blitz', times.blitzGames],
        ['Live', times.liveGames],
        ['Correspondence', times.correspondenceGames]
      ],
      chartData2: times.blitzGames > 0 ? [
        ['Result', 'Games'],
        ['Losses', times.blitzLosses],
        ['Wins', (times.blitzGames - times.blitzLosses)],
      ] : null,
      chartData3: times.liveGames > 0 ? [
        ['Result', 'Games'],
        ['Losses', times.liveLosses],
        ['Wins', (times.liveGames - times.liveLosses)],
      ] : null,
      chartData4: times.correspondenceGames > 0 ? [
        ['Result', 'Games'],
        ['Losses', times.correspondenceLosses],
        ['Wins', (times.correspondenceGames - times.correspondenceLosses)],
      ] : null
    });
  }

  render() {
    return (
      <section className="stats_block">
        <h2 id={this.props.id} className="text-center">{this.props.title}</h2>
        <div className="row">
          {
            this.state.chartData1 ? (
              <div className="col-sm-6 mr-auto ml-auto">
                <Chart
                  chartType="PieChart"
                  options={this.state.mainChartOptions}
                  data={this.state.chartData1}
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
            this.state.chartData2 ? (
              <div className="col-md-4">
                <h5 className="text-center">Blitz</h5>
                <Chart
                  chartType="PieChart"
                  options={this.state.pieChartOptions}
                  data={this.state.chartData2}
                  width={'100%'}
                  height={'250px'}
                />
              </div>
            ) : null
          }
          {
            this.state.chartData3 ? (
              <div className="col-md-4">
                <h5 className="text-center">Live</h5>
                <Chart
                  chartType="PieChart"
                  options={this.state.pieChartOptions}
                  data={this.state.chartData3}
                  width={'100%'}
                  height={'250px'}
                />
              </div>
            ) : null
          }
          {
            this.state.chartData4 ? (
              <div className="col-md-4">
                <h5 className="text-center">Correspondence</h5>
                <Chart
                  chartType="PieChart"
                  options={this.state.pieChartOptions}
                  data={this.state.chartData4}
                  width={'100%'}
                  height={'250px'}
                />
              </div>
            ) : null
          }
        </div>
      </section>
    );
  }
}

export default TimeSettingsChart;
