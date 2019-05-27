import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import configs from '../../OGSApi/configs.json';
import Analyzer from '../../Data/Analyzer';
import { rankNumberToKyuDan } from "../../Data/utils";

class OpponentChart extends Component {
  static propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    gamesData: PropTypes.shape({
      playerId: PropTypes.number.isRequired,
      games: PropTypes.array.isRequired
    }).isRequired,
    player: PropTypes.object.isRequired
  }

  generateChartData(gamesData) {
    const opponentsInfo = Analyzer.computeOpponentsInfo(gamesData.games, gamesData.playerId);

    // OGS data allow up to 30k but realistically no one's below 25k on OGS. Subtract 5 so 25k is at leftmost
    const weakestBarRate = opponentsInfo.weakestOpp.rank - 5;
    const strongestBarRate = opponentsInfo.strongestOpp.rank - 5;
    const userBarRate = this.props.player.rank - 5;

    return {
      numberOfOpponents: opponentsInfo.numberOfOpponents,
      weakestLegendStyle: { marginLeft: `${weakestBarRate * 3.03030303}%` },
      strongestLegendStyle: { marginLeft: `${(strongestBarRate - weakestBarRate) * 3.03030303}%` },
      weakestDisp: {
        href: `${configs.OGS_ROOT}user/view/${opponentsInfo.weakestOpp.id}/${opponentsInfo.weakestOpp.username}`,
        title: `${opponentsInfo.weakestOpp.username} (${rankNumberToKyuDan(opponentsInfo.weakestOpp.rank)})`,
        style: { left: `${weakestBarRate * 3.03030303}%` },
        img: `${configs.OGS_API_ROOT}${opponentsInfo.weakestOpp.id}/icon?size=32`
      },
      userDisp: {
        href: `${configs.OGS_ROOT}user/view/${this.props.player.id}/${this.props.player.username}`,
        title: `${this.props.player.username} (${rankNumberToKyuDan(this.props.player.rank)})`,
        style: { left: `${userBarRate * 3.03030303}%` },
        img: `${configs.OGS_API_ROOT}${this.props.player.id}/icon?size=32`
      },
      strongestDisp: {
        href: `${configs.OGS_ROOT}user/view/${opponentsInfo.strongestOpp.id}/${opponentsInfo.strongestOpp.username}`,
        title: `${opponentsInfo.strongestOpp.username} (${rankNumberToKyuDan(opponentsInfo.strongestOpp.rank)})`,
        style: { left: `${strongestBarRate * 3.03030303}%` },
        img: `${configs.OGS_API_ROOT}${opponentsInfo.strongestOpp.id}/icon?size=32`
      },
      mostPlayedDisp: {
        href: `${configs.OGS_ROOT}user/view/${opponentsInfo.mostPlayed.id}/${opponentsInfo.mostPlayed.username}`,
        img: `${configs.OGS_API_ROOT}${opponentsInfo.mostPlayed.id}/icon?size=32`,
        username: `${opponentsInfo.mostPlayed.username} (${rankNumberToKyuDan(opponentsInfo.mostPlayed.rank)})`,
        games: opponentsInfo.mostPlayed.games
      },
      strongestDefeatedDisp: {
        href: `${configs.OGS_ROOT}user/view/${opponentsInfo.strongestDefeated.id}/${opponentsInfo.strongestDefeated.username}`,
        img: `${configs.OGS_API_ROOT}${opponentsInfo.strongestDefeated.id}/icon?size=32`,
        username: `${opponentsInfo.strongestDefeated.username} (${rankNumberToKyuDan(opponentsInfo.strongestDefeated.rank)})`,
        date: opponentsInfo.strongestDefeated.date,
        gameHref: `http://online-go.com/game/${opponentsInfo.strongestDefeated.url}`
      },
      averageGamePerOpponent: opponentsInfo.averageGamePerOpponent
    };
  }

  render() {

    const {
      numberOfOpponents,
      weakestLegendStyle,
      strongestLegendStyle,
      weakestDisp,
      userDisp,
      strongestDisp,
      mostPlayedDisp,
      strongestDefeatedDisp,
      averageGamePerOpponent
    } = this.generateChartData(this.props.gamesData);
    if (!numberOfOpponents) return <section className="stats_block" />;

    return (
      <section className="stats_block">
        <h2 id={this.props.id} className="text-center">{this.props.title}: {numberOfOpponents}</h2>

        <div className="row">
          <div id="opponents_polars_chart" className="opponent_chart col-8 mr-auto ml-auto">
            <ul className="bar_legend">
              <li style={weakestLegendStyle}>
                <div>Weakest Opponent</div><span></span>
              </li>
              <li style={strongestLegendStyle}>
                <div>Strongest Opponent</div><span></span>
              </li>
            </ul>
            <div className="bar_chart">
              <a target="_blank"
                rel="noopener noreferrer"
                href={weakestDisp.href}
                data-toggle="tooltip"
                data-placement="top"
                title={weakestDisp.title}
                style={weakestDisp.style}>
                <img src={weakestDisp.img} alt={weakestDisp.title} />
              </a>
              <a target="_blank"
                rel="noopener noreferrer"
                href={userDisp.href}
                data-toggle="tooltip"
                data-placement="top"
                title={userDisp.title}
                style={userDisp.style}>
                <img src={userDisp.img} alt={userDisp.title} />
              </a>
              <a target="_blank"
                rel="noopener noreferrer"
                href={strongestDisp.href}
                data-toggle="tooltip"
                data-placement="top"
                title={strongestDisp.title}
                style={strongestDisp.style}>
                <img src={strongestDisp.img} alt={strongestDisp.title} />
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
                <a target="_blank" rel="noopener noreferrer" href={mostPlayedDisp.href}>
                  <img className="img-20" src={mostPlayedDisp.img} alt={mostPlayedDisp.username} />
                  {' '}
                  {mostPlayedDisp.username}
                </a>
                {' '}
                in {mostPlayedDisp.games} games.
              </li>

              {
                !!strongestDefeatedDisp.username &&
                (<li>
                  Scored a triumphant victory against
                {' '}
                  <a target="_blank" rel="noopener noreferrer nofollow" href={strongestDefeatedDisp.href}>
                    <img className="img-20" src={strongestDefeatedDisp.img} alt={strongestDefeatedDisp.username} />
                    {' '}
                    {strongestDefeatedDisp.username}
                  </a>
                  {' '}
                  on <a href={strongestDefeatedDisp.gameHref} target="_blank" rel="noopener noreferrer nofollow">{moment(strongestDefeatedDisp.date).format('MMM DD, YYYY')}</a>.
              </li>)
              }
              <li>Average game per opponent: {averageGamePerOpponent} games.</li>
            </ul>
          </div>
        </div>
      </section >
    );
  }
}

export default OpponentChart;
