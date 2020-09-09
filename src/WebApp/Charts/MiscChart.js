import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "moment-precise-range-plugin";

import {
  isPlayerWin,
  extractPlayerAndOpponent,
  daysDifferenceBetween,
} from "../../Shared/utils";

import PlayerLink from "../../Shared/Components/PlayerLink";
import GameLink from "../../Shared/Components/GameLink";

class MiscChart extends Component {
  static propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    games: PropTypes.array.isRequired,
    player: PropTypes.object.isRequired,
  };

  state = {
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

  computeMiscInfo = (analyzingGames, player) => {
    let mostActiveDay;
    let currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);

    let totalLosses = 0;

    let longestStreak = { streak: 0 };
    let currentStreak = { streak: 0 };

    let gamesOnMostActiveDay = 0,
      gamesOnCurrentDay = 0;

    let biggestWin = { diff: 0 };

    let longestGame = { game: null, duration: 0 };

    for (let game of analyzingGames) {
      const isWin = isPlayerWin(game, player.id);

      // Longest streak
      if (isWin) {
        currentStreak.streak++;
        currentStreak.start = game;

        if (!currentStreak.end) currentStreak.end = game;

        if (currentStreak.streak > longestStreak.streak)
          longestStreak = currentStreak;
      } else currentStreak = { streak: 0 };

      // Biggest win
      if (isWin) {
        const { opponent } = extractPlayerAndOpponent(game, player.id);
        if (!isNaN(game.outcome.split(" ")[0])) {
          const scoreDiff = parseFloat(game.outcome.split(" ")[0]);
          if (scoreDiff > biggestWin.diff) {
            biggestWin = {
              game: game,
              opponent: opponent,
              diff: scoreDiff,
            };
          }
        }
      }
      // Total losses
      else totalLosses++;

      // Most active day
      let gameDay = new Date(game.ended);
      gameDay.setHours(0, 0, 0, 0);
      if (daysDifferenceBetween(currentDay, gameDay) !== 0) {
        currentDay = gameDay;
        gamesOnCurrentDay = 1;
      } else {
        gamesOnCurrentDay++;
      }

      if (gamesOnCurrentDay > gamesOnMostActiveDay) {
        mostActiveDay = currentDay;
        gamesOnMostActiveDay = gamesOnCurrentDay;
      }

      // Game duration
      if (game.ended && game.started) {
        const gameDuration = moment
          .duration(moment(game.ended).diff(moment(game.started)))
          .asMilliseconds();
        if (gameDuration > longestGame.duration) {
          longestGame = {
            game,
            duration: gameDuration,
          };
        }
      }
    }

    let memberSince = new Date(player.registrationDate);
    // Change memberSince to date of first game for player who migrated from old server
    if (analyzingGames.length) {
      let firstGameDate = new Date(
        analyzingGames[analyzingGames.length - 1].started
      );
      if (firstGameDate < memberSince) memberSince = firstGameDate;
    }

    let gamesPerDay = 0;
    if (analyzingGames.length) {
      let dateOfFirstGame = new Date(
        analyzingGames[analyzingGames.length - 1].started
      );
      let daysSinceStart = daysDifferenceBetween(new Date(), dateOfFirstGame);
      gamesPerDay = analyzingGames.length / parseFloat(daysSinceStart);
    }

    const uniqueTournaments = analyzingGames
      .filter((game) => game.tournament !== null)
      .reduce((result, game) => {
        if (result.indexOf(game.tournament) === -1) {
          result.push(game.tournament);
        }

        return result;
      }, []).length;

    return {
      memberSince,
      gamesPerDay,
      longestStreak,
      mostActiveDay,
      gamesOnMostActiveDay,
      biggestWin,
      uniqueTournaments,
      totalLosses,
      longestGame: longestGame.game,
    };
  };

  render() {
    const { games, player } = this.props;
    const {
      memberSince,
      gamesPerDay,
      longestStreak,
      mostActiveDay,
      gamesOnMostActiveDay,
      biggestWin,
      totalLosses,
      uniqueTournaments,
      longestGame,
    } = this.computeMiscInfo(games, player);

    const streakDurationDisplay = longestStreak.end ? (
      <span>
        , from <GameLink game={longestStreak.start} /> to{" "}
        <GameLink game={longestStreak.end} />
      </span>
    ) : (
      ""
    );
    const biggestWinDisplay = biggestWin.game && (
      <li>
        Biggest win: {biggestWin.diff} points victory against{" "}
        <PlayerLink player={biggestWin.opponent} /> on{" "}
        <GameLink game={biggestWin.game} />.
      </li>
    );
    return (
      <section className="stats_block">
        <h2 id={this.props.id} className="text-center">
          {this.props.title}
        </h2>
        <ul className="info_list">
          <li>Member since: {moment(memberSince).format("DD MMM, YYYY")}.</li>
          <li>Plays {gamesPerDay.toFixed(3)} games per day on average.</li>
          <li>
            Most active day: {moment(mostActiveDay).format("DD MMM, YYYY")} with{" "}
            {gamesOnMostActiveDay} finished games.
          </li>
          <li>Played in {uniqueTournaments} tournaments.</li>
          <li>
            Longest win streak: {longestStreak.streak} wins in a row
            {streakDurationDisplay}.
          </li>
          {biggestWinDisplay}
          {longestGame && (
            <li>
              Longest game: <GameLink game={longestGame} /> lasting{" "}
              {moment.preciseDiff(longestGame.ended, longestGame.started)}
            </li>
          )}
          {totalLosses >= 50 && (
            <li>
              Congratulations,{" "}
              <a
                target="_blank"
                rel="noopener noreferrer nofollow"
                href="http://senseis.xmp.net/?page=LoseYourFirst50GamesAsQuicklyAsPossible"
              >
                you have lost your first 50 games
              </a>
              !
            </li>
          )}
        </ul>
      </section>
    );
  }
}

export default MiscChart;
