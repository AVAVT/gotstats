import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-google-charts';
import Analyzer from '../../Data/Analyzer';

class ResultDistributionChart extends Component {
  static propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    gamesData: PropTypes.shape({
      playerId: PropTypes.number.isRequired,
      games: PropTypes.array.isRequired
    }).isRequired,
    player: PropTypes.object.isRequired
  }

  state = {
    pieChartOptions: {
      backgroundColor: "transparent",
      chartArea: { top: 10 },
      colors: ["#d93344", "#41CD64", "#5486d1", "#9d4dc5"],
      pieSliceTextStyle: { color: "#ffffff" },
      legend: {
        position: "bottom",
        textStyle: {
          color: "#f8f8ff",
          fontName: "Roboto",
          fontSize: 14
        }
      }
    },
    columnChartOptions: {
      backgroundColor: "transparent",
      isStacked: true,
      chartArea: { top: 10 },
      colors: ["#d93344", "#41CD64", "#5486d1", "#9d4dc5"],
      legend: {
        maxLines: 2,
        position: "bottom",
        textStyle: {
          color: "#f8f8ff",
          fontName: "Roboto",
          fontSize: 14
        }
      },
      hAxis: { textStyle: { color: "#f8f8ff", fontName: "Roboto", fontSize: 11 } },
      vAxis: { textStyle: { color: "#f8f8ff", fontName: "Roboto", fontSize: 11 } }
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
    const distributions = Analyzer.computeWinLoseDistributions(gamesData.games, gamesData.playerId);

    this.setState({
      chartData1: [
        ['Result', 'Games'],
        ['Resign', distributions["Plr+Res"]],
        ['Timeout', distributions["Plr+Time"]],
        ['Scoring', distributions["Plr+Count"]],
        ['Other', distributions["Plr+Other"]]
      ],
      chartData2: [
        ['Result', 'Games'],
        ['Resign', distributions["Opp+Res"]],
        ['Timeout', distributions["Opp+Time"]],
        ['Scoring', distributions["Opp+Count"]],
        ['Other', distributions["Opp+Other"]]
      ],
      chartData3: [
        ['Outcome', 'Games opponent wins', `Games ${this.props.player.username} wins`],
        ['40+', distributions["Opp+40+"], null],
        ['30+', distributions["Opp+30+"], null],
        ['20+', distributions["Opp+20+"], null],
        ['10+', distributions["Opp+10+"], null],
        ['0+', distributions["Opp+0+"], null],
        ['0+', null, distributions["Plr+0+"]],
        ['10+', null, distributions["Plr+10+"]],
        ['20+', null, distributions["Plr+20+"]],
        ['30+', null, distributions["Plr+30+"]],
        ['40+', null, distributions["Plr+40+"]]
      ]
    });
  }

  render() {
    return (
      <section className="stats_block">
        <h2 id={this.props.id} className="text-center">{this.props.title}</h2>
        <div className="row">
          {
            this.state.chartData2 ? (
              <div className="col-md-6">
                <h5 className="text-center">Losses</h5>
                <Chart
                  chartType="PieChart"
                  options={this.state.pieChartOptions}
                  data={this.state.chartData2}
                  width={'100%'}
                  height={'300px'}
                />
              </div>
            ) : null
          }
          {
            this.state.chartData1 ? (
              <div className="col-md-6">
                <h5 className="text-center">Wins</h5>
                <Chart
                  chartType="PieChart"
                  options={this.state.pieChartOptions}
                  data={this.state.chartData1}
                  width={'100%'}
                  height={'300px'}
                />
              </div>
            ) : null
          }
        </div>
        <div className="row">
          {
            this.state.chartData3 ? (
              <div className="col-12">
                <h3 className="text-center">Final scoring distribution</h3>
                <Chart
                  chartType="ColumnChart"
                  options={this.state.columnChartOptions}
                  data={this.state.chartData3}
                  width={'100%'}
                  height={'300px'}
                />
              </div>
            ) : null
          }
        </div>
      </section>
    );
  }
}

export default ResultDistributionChart;
