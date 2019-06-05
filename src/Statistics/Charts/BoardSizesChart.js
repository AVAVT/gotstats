import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-google-charts';
import { connect } from 'react-redux';
import { isPlayerWin } from '../../Data/utils';

class BoardSizesChart extends Component {
  static propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    chartsData: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired
  }

  state = {
    mainChartOptions: {
      backgroundColor: "transparent",
      chartArea: {
        top: 60,
        left: 0,
        right: 0
      },
      colors: ["#d93344", "#41CD64", "#5486d1", "#9d4dc5"],
      pieSliceTextStyle: { color: "#ffffff" },
      legend: {
        maxLines: 2,
        position: "bottom",
        alignment: 'center',
        textStyle: {
          color: "#f8f8ff",
          fontName: "Roboto",
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
          fontName: "Roboto",
          fontSize: 14
        }
      }
    }
  }

  computeBoardSizes = (games, playerId) => {
    var nineteenGames = 0, thirteenGames = 0, nineGames = 0, otherGames = 0,
      nineteenLosses = 0, thirteenLosses = 0, nineLosses = 0, otherLosses = 0;

    games.forEach(game => {
      if (game.width === 19 && game.height === 19) {
        nineteenGames++;
        if (!isPlayerWin(game, playerId)) nineteenLosses++;
      }
      else if (game.width === 13 && game.height === 13) {
        thirteenGames++;
        if (!isPlayerWin(game, playerId)) thirteenLosses++;
      }
      else if (game.width === 9 && game.height === 9) {
        nineGames++;
        if (!isPlayerWin(game, playerId)) nineLosses++;
      }
      else {
        otherGames++;
        if (!isPlayerWin(game, playerId)) otherLosses++;
      }
    });

    return {
      nineteenGames, thirteenGames, nineGames, otherGames,
      nineteenLosses, thirteenLosses, nineLosses, otherLosses
    }
  }

  generateChartData = (games, playerId) => {
    const sizes = this.computeBoardSizes(games, playerId);

    return {
      chartData1: [
        ['Size', 'Games'],
        ['19x19', sizes.nineteenGames],
        ['13x13', sizes.thirteenGames],
        ['9x9', sizes.nineGames],
        ['Other', sizes.otherGames],
      ],
      chartData2: sizes.nineteenGames > 0 ? [
        ['Result', 'Games'],
        ['Losses', sizes.nineteenLosses],
        ['Wins', (sizes.nineteenGames - sizes.nineteenLosses)],
      ] : null,
      chartData3: sizes.thirteenGames > 0 ? [
        ['Result', 'Games'],
        ['Losses', sizes.thirteenLosses],
        ['Wins', (sizes.thirteenGames - sizes.thirteenLosses)],
      ] : null,
      chartData4: sizes.nineGames > 0 ? [
        ['Result', 'Games'],
        ['Losses', sizes.nineLosses],
        ['Wins', (sizes.nineGames - sizes.nineLosses)],
      ] : null,
      chartData5: sizes.otherGames > 0 ? [
        ['Result', 'Games'],
        ['Losses', sizes.otherLosses],
        ['Wins', (sizes.otherGames - sizes.otherLosses)],
      ] : null
    };
  }

  render() {
    const { chartsData, player } = this.props;

    const {
      chartData1,
      chartData2,
      chartData3,
      chartData4,
      chartData5
    } = this.generateChartData(chartsData.results, player.id);

    return (
      <section className="stats_block">
        <h2 id={this.props.id} className="text-center">{this.props.title}</h2>
        <div className="row">
          {
            chartData1 ? (
              <div className="col-md-6 mr-auto ml-auto">
                <Chart
                  chartType="PieChart"
                  options={this.state.mainChartOptions}
                  data={chartData1}
                  width={'100%'}
                  height={'400px'}
                />
              </div>
            ) : null
          }
        </div>
        <h3 className="text-center">Win/Loss ratio</h3>
        <div className="row">
          {
            chartData2 ? (
              <div className="col-md-6">
                <h5 className="text-center">19x19</h5>
                <Chart
                  chartType="PieChart"
                  options={this.state.pieChartOptions}
                  data={chartData2}
                  width={'100%'}
                  height={'250px'}
                />
              </div>
            ) : null
          }
          {
            chartData3 ? (
              <div className="col-md-6">
                <h5 className="text-center">13x13</h5>
                <Chart
                  chartType="PieChart"
                  options={this.state.pieChartOptions}
                  data={chartData3}
                  width={'100%'}
                  height={'250px'}
                />
              </div>
            ) : null
          }
          {
            chartData4 ? (
              <div className="col-md-6">
                <h5 className="text-center">9x9</h5>
                <Chart
                  chartType="PieChart"
                  options={this.state.pieChartOptions}
                  data={chartData4}
                  width={'100%'}
                  height={'250px'}
                />
              </div>
            ) : null
          }
          {
            chartData5 ? (
              <div className="col-md-6">
                <h5 className="text-center">Other Sizes</h5>
                <Chart
                  chartType="PieChart"
                  options={this.state.pieChartOptions}
                  data={chartData5}
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

export default connect(({ chartsData, player }) => ({ chartsData, player }))(BoardSizesChart);
