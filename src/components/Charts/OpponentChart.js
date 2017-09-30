import React, { Component } from 'react';
import PropTypes from 'prop-types';

import configs from '../../configs.json';
import Analyzer from '../../services/Analyzer';

class OpponentChart extends Component {
  static propTypes = {
    title : PropTypes.string,
    id    : PropTypes.string,
    gamesData : PropTypes.shape({
      playerId: PropTypes.number.isRequired,
      games   : PropTypes.array.isRequired
    }).isRequired,
    player : PropTypes.object.isRequired
  }

  state = { }

  componentDidMount(){
    this.generateChartData(this.props.gamesData);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.gamesData !== this.props.gamesData){
      this.generateChartData(nextProps.gamesData);
    }
  }

  generateChartData(gamesData){
    const opponentsInfo = Analyzer.computeOpponentsInfo(gamesData.games, gamesData.playerId);

    // OGS data allow up to 30k but realistically no one's below 25k on OGS. Subtract 5 so 25k is at leftmost
    const weakestBarRate = opponentsInfo.weakestOpp.rank - 5;
    const strongestBarRate = opponentsInfo.strongestOpp.rank - 5;
    const userBarRate = this.props.player.ranking - 5;

    this.setState({
      numberOfOpponents   : opponentsInfo.numberOfOpponents,
      weakestLegendStyle  : {marginLeft: `${weakestBarRate/33 * 100}%`},
      strongestLegendStyle: {marginLeft: `${(strongestBarRate-weakestBarRate)/33 * 100}%`},
      weakestDisp         : {
        href : `${configs.OGS_ROOT}user/view/${opponentsInfo.weakestOpp.id}/${opponentsInfo.weakestOpp.username}`,
        title: `${opponentsInfo.weakestOpp.username} (${Analyzer.rankNumberToKyuDan(opponentsInfo.weakestOpp.rank)})`,
        style: {left: `${weakestBarRate/33 * 100}%`},
        img  : `${configs.OGS_API_ROOT}${opponentsInfo.weakestOpp.id}/icon?size=32`
      },
      userDisp            : {
        href : `${configs.OGS_ROOT}user/view/${this.props.player.id}/${this.props.player.username}`,
        title: `${this.props.player.username} (${Analyzer.rankNumberToKyuDan(this.props.player.ranking)})`,
        style: {left: `${userBarRate/33 * 100}%`},
        img  : `${configs.OGS_API_ROOT}${this.props.player.id}/icon?size=32`
      },
      strongestDisp       : {
        href : `${configs.OGS_ROOT}user/view/${opponentsInfo.strongestOpp.id}/${opponentsInfo.strongestOpp.username}`,
        title: `${opponentsInfo.strongestOpp.username} (${Analyzer.rankNumberToKyuDan(opponentsInfo.strongestOpp.rank)})`,
        style: {left: `${strongestBarRate/33 * 100}%`},
        img  : `${configs.OGS_API_ROOT}${opponentsInfo.strongestOpp.id}/icon?size=32`
      },
      mostPlayedDisp      : {
        href    : `${configs.OGS_ROOT}user/view/${opponentsInfo.mostPlayed.id}/${opponentsInfo.mostPlayed.username}`,
        img     : `${configs.OGS_API_ROOT}${opponentsInfo.mostPlayed.id}/icon?size=32`,
        username: `${opponentsInfo.mostPlayed.username} (${Analyzer.rankNumberToKyuDan(opponentsInfo.mostPlayed.rank)})`,
        games   : opponentsInfo.mostPlayed.games
      },
      strongestDefeatedDisp    : {
        href    : `${configs.OGS_ROOT}user/view/${opponentsInfo.strongestDefeated.id}/${opponentsInfo.strongestDefeated.username}`,
        img     : `${configs.OGS_API_ROOT}${opponentsInfo.strongestDefeated.id}/icon?size=32`,
        username: `${opponentsInfo.strongestDefeated.username} (${Analyzer.rankNumberToKyuDan(opponentsInfo.strongestDefeated.rank)})`,
        gameHref: `http://online-go.com/game/${opponentsInfo.strongestDefeated.url}`
      },
      averageGamePerOpponent : opponentsInfo.averageGamePerOpponent
    });
  }

  render() {
    if(!this.state.numberOfOpponents) return <section className="stats_block" />;

    return (
      <section className="stats_block">
        <h2 id={this.props.id} className="text-center">{this.props.title}: {this.state.numberOfOpponents}</h2>

        <div className="row">
          <div id="opponents_polars_chart" className="opponent_chart col-8 mr-auto ml-auto">
            <ul className="bar_legend">
              <li style={this.state.weakestLegendStyle}>
                <div>Weakest Opponent</div><span></span>
              </li>
              <li style={this.state.strongestLegendStyle}>
                <div>Strongest Opponent</div><span></span>
              </li>
            </ul>
            <div className="bar_chart">
              <a target="_blank"
                  rel="noopener noreferrer"
                  href={this.state.weakestDisp.href}
                  data-toggle="tooltip"
                  data-placement="top"
                  title={this.state.weakestDisp.title}
                  style={this.state.weakestDisp.style}>
                <img src={this.state.weakestDisp.img} alt={this.state.weakestDisp.title} />
              </a>
              <a target="_blank"
                  rel="noopener noreferrer"
                  href={this.state.userDisp.href}
                  data-toggle="tooltip"
                  data-placement="top"
                  title={this.state.userDisp.title}
                  style={this.state.userDisp.style}>
                <img src={this.state.userDisp.img} alt={this.state.userDisp.title} />
              </a>
              <a target="_blank"
                  rel="noopener noreferrer"
                  href={this.state.strongestDisp.href}
                  data-toggle="tooltip"
                  data-placement="top"
                  title={this.state.strongestDisp.title}
                  style={this.state.strongestDisp.style}>
                <img src={this.state.strongestDisp.img} alt={this.state.strongestDisp.title} />
              </a>
            </div>
            <ul className="ruler">
              <li><span></span><div><small><em>25k</em></small></div></li>
              <li><span></span><div><small><em>10k</em></small></div></li>
              <li><span></span><div><small><em>1d</em></small></div></li>
              <li><span></span><div><small><em>9d</em></small></div></li>
            </ul>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <ul className="info_list">
              <li>
                Most played with:
                {' '}
                <a target="_blank" rel="noopener noreferrer" href={this.state.mostPlayedDisp.href}>
                  <img className="img-20" src={this.state.mostPlayedDisp.img} alt={this.state.mostPlayedDisp.username} />
                  {' '}
                  {this.state.mostPlayedDisp.username}
                </a>
                {' '}
                in {this.state.mostPlayedDisp.games} games.
              </li>
              <li>
                Scored a triumphant victory against
                {' '}
                <a target="_blank" rel="noopener noreferrer" href={this.state.strongestDefeatedDisp.href}>
                  <img className="img-20" src={this.state.strongestDefeatedDisp.img} alt={this.state.strongestDefeatedDisp.username} />
                  {' '}
                  {this.state.strongestDefeatedDisp.username}
                </a>
                {' '}
                in
                {' '}
                <a href={this.state.strongestDefeatedDisp.gameHref} target="_blank" rel="noopener noreferrer">
                  a bloody game
                </a>.
              </li>
              <li>Average game per opponent: {this.state.averageGamePerOpponent} games.</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }
}

export default OpponentChart;
