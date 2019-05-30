import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Analyzer from '../../Data/Analyzer';
import moment from "moment";

import PlayerLink from "../../SharedComponents/PlayerLink";
import GameLink from "../../SharedComponents/GameLink";

class MiscChart extends Component {
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

  render() {
    const { gamesData, player } = this.props;
    const {
      memberSince,
      gamesPerDay,
      longestStreak,
      mostActiveDay,
      gamesOnMostActiveDay,
      biggestWin,
      totalLosses,
      uniqueTournaments
    } = Analyzer.computeMiscInfo(gamesData.games, player);

    const streakDurationDisplay = longestStreak.end ? <span>, from <GameLink game={longestStreak.start} /> to <GameLink game={longestStreak.end} /></span> : '';
    const biggestWinDisplay = biggestWin.game && (
      <li>Biggest win: {biggestWin.diff} points victory against <PlayerLink player={biggestWin.opponent} /> on <GameLink game={biggestWin.game} />.</li>
    )
    return (
      <section className="stats_block">
        <h2 id={this.props.id} className="text-center">{this.props.title}</h2>
        <ul className="info_list">
          <li>Member since: {moment(memberSince).format("DD MMM, YYYY")}.</li>
          {totalLosses >= 50 && (
            <li>Congratulations, <a target="_blank" rel="noopener noreferrer nofollow" href="http://senseis.xmp.net/?page=LoseYourFirst50GamesAsQuicklyAsPossible">you have lost your first 50 games</a>!</li>
          )}
          <li>Plays {Math.round(gamesPerDay * 100) / 100} games per day on average.</li>
          <li>Most active day: {moment(mostActiveDay).format("DD MMM, YYYY")} with {gamesOnMostActiveDay} finished games.</li>
          <li>Played in {uniqueTournaments} different tournaments.</li>
          <li>Longest win streak: {longestStreak.streak} wins in a row{streakDurationDisplay}.</li>
          {biggestWinDisplay}
        </ul>
      </section>
    );
  }
}

export default MiscChart;
