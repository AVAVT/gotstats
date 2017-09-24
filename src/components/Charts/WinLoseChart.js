import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-google-charts';

import Analyzer from '../../services/Analyzer';

class WinLoseChart extends Component {
  static propTypes = {
    title : PropTypes.string,
    id    : PropTypes.string,
    gamesData : PropTypes.shape({
      playerId: PropTypes.number.isRequired,
      games   : PropTypes.array.isRequired
    }).isRequired,
    footer : PropTypes.element
  }

  state = {
    mainChartOptions : {
      backgroundColor     : "transparent",
      chartArea           : { top: 30 },
      colors              : ["#000000", "#f8f8ff"],
      pieSliceTextStyle   : {color: "#d93344"},
      legend              : {
        position: "bottom",
        textStyle: {
          color: "#f8f8ff",
          fontName: "Helvetica Neue",
          fontSize: 14
        }
      }
    },
    subChartOptions : {
      backgroundColor     : "transparent",
      chartArea           : { top: 10 },
      colors              : ["#d93344","#41CD64", "#5486d1", "#9d4dc5"],
      pieSliceTextStyle   : {color: "#ffffff"},
      legend              : {
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

  componentDidMount(){
    this.generateChartData(this.props.gamesData);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.gamesData !== this.props.gamesData){
      this.generateChartData(nextProps.gamesData);
    }
  }

  generateChartData(gamesData){
    const statistics = Analyzer.computeWinLoseStatistics(gamesData.games, gamesData.playerId);

    this.setState({
      chartData1: [
  			['Color', 'Games'],
  			['Black', statistics.blackGames],
        ['White', statistics.whiteGames],
  		],
      chartData2: [
  			['Result', 'Games'],
  			['Losses', (statistics.blackLosses + statistics.whiteLosses)],
        ['Wins', (statistics.blackGames + statistics.whiteGames) - (statistics.blackLosses + statistics.whiteLosses)],
  		],
      chartData3: statistics.blackGames > 0 ? [
  			['Result', 'Games'],
  			['Losses', statistics.blackLosses],
        ['Wins', statistics.blackGames - statistics.blackLosses],
  		] : null,
      chartData4: statistics.whiteGames > 0 ? [
  			['Result', 'Games'],
  			['Losses', statistics.whiteLosses],
        ['Wins', statistics.whiteGames - statistics.whiteLosses],
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
              <div className="col-sm-offset-3 col-sm-6">
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
              <div className="col-sm-4">
                <h5 className="text-center">Total</h5>
                <Chart
                  chartType="PieChart"
                  options={this.state.subChartOptions}
                  data={this.state.chartData2}
                  width={'100%'}
                  height={'250px'}
                />
              </div>
            ) : null
          }
          {
            this.state.chartData3 ? (
              <div className="col-sm-4">
                <h5 className="text-center">As Black</h5>
                <Chart
                  chartType="PieChart"
                  options={this.state.subChartOptions}
                  data={this.state.chartData3}
                  width={'100%'}
                  height={'250px'}
                />
              </div>
            ) : null
          }
          {
            this.state.chartData4 ? (
              <div className="col-sm-4">
                <h5 className="text-center">As White</h5>
                <Chart
                  chartType="PieChart"
                  options={this.state.subChartOptions}
                  data={this.state.chartData4}
                  width={'100%'}
                  height={'250px'}
                />
              </div>
            ) : null
          }
        </div>
        {
          this.props.footer ? this.props.footer : null
        }
      </section>
    );
  }
}

export default WinLoseChart;
