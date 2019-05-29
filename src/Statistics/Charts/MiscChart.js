import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Analyzer from '../../Data/Analyzer';
import moment from "moment";
import { getPlayerRankDisplay } from "../../Data/utils";
import { OGS_ROOT, OGS_API_ROOT } from "../../OGSApi/configs.json";

class MiscChart extends Component {
  static propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    allGames: PropTypes.array.isRequired,
    gamesData: PropTypes.shape({
      playerId: PropTypes.number.isRequired,
      games: PropTypes.array.isRequired
    }).isRequired,
    player: PropTypes.object.isRequired
  }

  state = {
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

  createLinkToGame = (game) => <a href={`${OGS_ROOT}game/${game.related.detail.split("games/")[1]}`} target="_blank" rel="noopener noreferrer nofollow">{moment(game.ended).format("DD MMM, YYYY")}</a>

  createLinkToPlayer = (player) => {
    const href = `${OGS_ROOT}user/view/${player.id}/${player.username}`;
    const img = `${OGS_API_ROOT}${player.id}/icon?size=32`;
    const username = `${player.username} (${getPlayerRankDisplay(player)})`;

    return (
      <a target="_blank" rel="noopener noreferrer nofollow" href={href}>
        <img className="img-20" src={img} alt={username} /> {username}
      </a>
    )
  }
  render() {
    const { allGames, gamesData, player } = this.props;
    const {
      memberSince,
      gamesPerDay,
      longestStreak,
      mostActiveDay,
      gamesOnMostActiveDay,
      biggestWin
    } = Analyzer.computeMiscInfo(allGames, gamesData.games, player);

    const streakDurationDisplay = longestStreak.end ? <span>, from {this.createLinkToGame(longestStreak.start)} to {this.createLinkToGame(longestStreak.end)}</span> : '';
    const biggestWinDisplay = biggestWin.game && (
      <li>Biggest win: {biggestWin.diff} points victory against {this.createLinkToPlayer(biggestWin.opponent)} on {this.createLinkToGame(biggestWin.game)}.</li>
    )
    return (
      <section className="stats_block">
        <h2 id={this.props.id} className="text-center">{this.props.title}</h2>
        <div className="row">
          <ul className="info_list">
            <li>Member since: {moment(memberSince).format("DD MMM, YYYY")}.</li>
            <li>Plays {Math.round(gamesPerDay * 100) / 100} games per day on average.</li>
            <li>Longest win streak: {longestStreak.streak} wins in a row{streakDurationDisplay}.</li>
            {biggestWinDisplay}
            <li>Most active day: {moment(mostActiveDay).format("DD MMM, YYYY")} with {gamesOnMostActiveDay} finished games.</li>
          </ul>
        </div>
      </section>
    );
  }
}

export default MiscChart;
