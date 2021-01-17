import React, { Component } from "react";
import PropTypes from "prop-types";

import configs from "../../OGSApi/configs.json";
import {
  isPlayerWin,
  getPlayerRankDisplay,
  getPlayerRank,
  getPlayerRating,
  extractPlayerAndOpponent,
  extractHistoricalPlayerAndOpponent,
} from "../../Shared/utils";

import PlayerLink from "../../Shared/Components/PlayerLink";
import GameLink from "../../Shared/Components/GameLink";

class OpponentChart extends Component {
  static propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    games: PropTypes.array.isRequired,
    player: PropTypes.object.isRequired,
  };

  computeOpponentsInfo = (games, player) => {
    var opponents = {},
      numberOfOpponents = 0;
    var weakestOpp = { rank: 70 };
    var strongestOpp = { rank: 0 };
    var mostPlayed = { games: 0 };
    var strongestDefeated = { ratingDiff: -9999 };

    for (const game of games) {
      const isWin = isPlayerWin(game, player.id);

      const { opponent } = extractPlayerAndOpponent(game, player.id);
      const {
        historicalOpponent,
        historicalPlayer,
      } = extractHistoricalPlayerAndOpponent(game, player.id);
      const opponentRank = getPlayerRank(opponent);

      if (isWin) {
        const ratingDiff =
          getPlayerRating(opponent) -
          getPlayerRating(player) +
          getPlayerRating(historicalOpponent) -
          getPlayerRating(historicalPlayer);
        if (ratingDiff > strongestDefeated.ratingDiff)
          strongestDefeated = {
            ...opponent,
            ratingDiff,
            game,
          };
      }

      if (!opponents[opponent.id]) {
        opponents[opponent.id] = {
          opponent,
          rank: opponentRank,
          games: 1,
          win: isWin ? 1 : 0,
          loss: isWin ? 0 : 1,
        };
      } else {
        opponents[opponent.id].games++;
        if (isWin) {
          opponents[opponent.id].win++;
        } else {
          opponents[opponent.id].loss++;
        }
      }

      if (opponentRank > strongestOpp.rank)
        strongestOpp = {
          ...opponent,
          rank: opponentRank,
        };

      if (opponentRank < weakestOpp.rank)
        weakestOpp = {
          ...opponent,
          rank: opponentRank,
        };
    }

    const opponentsSortedByGames = Object.values(opponents).sort(
      (a, b) => b.games - a.games
    );
    if (opponentsSortedByGames.length > 0) {
      const mostPlayerOpp = opponentsSortedByGames[0];
      mostPlayed = {
        ...mostPlayerOpp.opponent,
        games: mostPlayerOpp.games,
      };
    }

    const recurringOpponents = opponentsSortedByGames.filter(
      (o) => o.games > 2
    );

    numberOfOpponents = Object.keys(opponents).length;

    return {
      strongestOpp,
      weakestOpp,
      mostPlayed,
      strongestDefeated,
      numberOfOpponents,
      recurringOpponents,
      averageGamePerOpponent: (games.length / numberOfOpponents).toFixed(2),
    };
  };

  generateChartData(games, player) {
    const opponentsInfo = this.computeOpponentsInfo(games, player);

    // OGS data allow up to 30k but realistically no one's below 25k on OGS. Subtract 5 so 25k is at leftmost
    const weakestBarRate = Math.max(opponentsInfo.weakestOpp.rank, 0) - 5;
    const strongestBarRate = Math.min(opponentsInfo.strongestOpp.rank, 42) - 5;
    const userBarRate = getPlayerRank(this.props.player) - 5;

    return {
      numberOfOpponents: opponentsInfo.numberOfOpponents,
      weakestDisp: {
        href: `${configs.OGS_ROOT}user/view/${opponentsInfo.weakestOpp.id}/${opponentsInfo.weakestOpp.username}`,
        title: `${opponentsInfo.weakestOpp.username} (${getPlayerRankDisplay(
          opponentsInfo.weakestOpp
        )})`,
        style: { left: `${weakestBarRate * 3.03030303}%` },
        img: `${configs.OGS_API_ROOT}${opponentsInfo.weakestOpp.id}/icon?size=32`,
      },
      userDisp: {
        href: `${configs.OGS_ROOT}user/view/${this.props.player.id}/${this.props.player.username}`,
        title: `${this.props.player.username} (${getPlayerRankDisplay(
          this.props.player
        )})`,
        style: { left: `${userBarRate * 3.03030303}%` },
        img: `${configs.OGS_API_ROOT}${this.props.player.id}/icon?size=32`,
      },
      strongestDisp: {
        href: `${configs.OGS_ROOT}user/view/${opponentsInfo.strongestOpp.id}/${opponentsInfo.strongestOpp.username}`,
        title: `${opponentsInfo.strongestOpp.username} (${getPlayerRankDisplay(
          opponentsInfo.strongestOpp
        )})`,
        style: { left: `${strongestBarRate * 3.03030303}%` },
        img: `${configs.OGS_API_ROOT}${opponentsInfo.strongestOpp.id}/icon?size=32`,
      },
      mostPlayedDisp: opponentsInfo.mostPlayed,
      strongestDefeatedDisp: opponentsInfo.strongestDefeated,
      averageGamePerOpponent: opponentsInfo.averageGamePerOpponent,
      recurringOpponents: opponentsInfo.recurringOpponents,
    };
  }

  render() {
    const { games, player } = this.props;
    const {
      numberOfOpponents,
      weakestDisp,
      userDisp,
      strongestDisp,
      mostPlayedDisp,
      strongestDefeatedDisp,
      averageGamePerOpponent,
      recurringOpponents,
    } = this.generateChartData(games, player);

    if (!numberOfOpponents) return <section className="stats_block" />;

    return (
      <section className="stats_block">
        <h2 id={this.props.id} className="text-center">
          {this.props.title}: {numberOfOpponents}
        </h2>

        <div className="row">
          <div
            id="opponents_polars_chart"
            className="opponent_chart col-8 mr-auto ml-auto"
          >
            <ul className="bar_legend">
              <li style={weakestDisp.style}>
                <div>Weakest Opponent</div>
                <span></span>
              </li>
              <li style={strongestDisp.style}>
                <div>Strongest Opponent</div>
                <span></span>
              </li>
            </ul>
            <div className="bar_chart">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={weakestDisp.href}
                data-toggle="tooltip"
                data-placement="top"
                title={weakestDisp.title}
                style={weakestDisp.style}
              >
                <img src={weakestDisp.img} alt={weakestDisp.title} />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={userDisp.href}
                data-toggle="tooltip"
                data-placement="top"
                title={userDisp.title}
                style={userDisp.style}
              >
                <img src={userDisp.img} alt={userDisp.title} />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={strongestDisp.href}
                data-toggle="tooltip"
                data-placement="top"
                title={strongestDisp.title}
                style={strongestDisp.style}
              >
                <img src={strongestDisp.img} alt={strongestDisp.title} />
              </a>
            </div>
            <ul className="ruler">
              <li>
                <span></span>
                <div>
                  <small>
                    <em>25k</em>
                  </small>
                </div>
              </li>
              <li>
                <span></span>
                <div>
                  <small>
                    <em>10k</em>
                  </small>
                </div>
              </li>
              <li>
                <span></span>
                <div>
                  <small>
                    <em>1d</em>
                  </small>
                </div>
              </li>
              <li>
                <span></span>
                <div>
                  <small>
                    <em>9d</em>
                  </small>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <ul className="info_list">
              <li>
                Most played with: <PlayerLink player={mostPlayedDisp} /> in{" "}
                {mostPlayedDisp.games} games.
              </li>
              {!!strongestDefeatedDisp.username && (
                <li>
                  Strongest defeated opponent:{" "}
                  <PlayerLink player={strongestDefeatedDisp} /> on{" "}
                  <GameLink game={strongestDefeatedDisp.game} />.
                </li>
              )}
              <li>
                Average game per opponent: {averageGamePerOpponent} games.
              </li>
              {recurringOpponents.length > 0 && (
                <li>
                  Regulars:
                  <div className="recurring-opponent-list mt-2">
                    <div className="px-3 py-2">
                      <strong>Games</strong>
                    </div>
                    <div className="px-3 py-2">
                      <strong>Win Rate</strong>
                    </div>
                    <div className="px-3 py-2">
                      <strong>Opponent</strong>
                    </div>
                    <div className="px-3 py-2">
                      <strong>Wins</strong>
                    </div>
                    <div className="px-3 py-2">
                      <strong>Losses</strong>
                    </div>
                    {recurringOpponents.map((opp, index) => (
                      <>
                        <div
                          className="px-3 py-2"
                          key={opp.opponent.id + "games"}
                          style={{
                            background:
                              index % 2 === 0
                                ? "rgba(0,0,0,0.3)"
                                : "transparent",
                          }}
                        >
                          {opp.games}
                        </div>
                        <div
                          className="px-3 py-2 text-right"
                          key={opp.opponent.id + "winrate"}
                          style={{
                            background:
                              index % 2 === 0
                                ? "rgba(0,0,0,0.3)"
                                : "transparent",
                          }}
                        >
                          {((100 * opp.win) / (opp.win + opp.loss)).toFixed(2)}%
                        </div>
                        <div
                          className="px-3 py-2"
                          key={opp.opponent.id + "name"}
                          style={{
                            background:
                              index % 2 === 0
                                ? "rgba(0,0,0,0.3)"
                                : "transparent",
                          }}
                        >
                          <PlayerLink player={opp.opponent} />
                        </div>
                        <div
                          className="px-3 py-2"
                          key={opp.opponent.id + "wins"}
                          style={{
                            background:
                              index % 2 === 0
                                ? "rgba(0,0,0,0.3)"
                                : "transparent",
                          }}
                        >
                          {opp.win}
                        </div>
                        <div
                          className="px-3 py-2"
                          key={opp.opponent.id + "losess"}
                          style={{
                            background:
                              index % 2 === 0
                                ? "rgba(0,0,0,0.3)"
                                : "transparent",
                          }}
                        >
                          {opp.loss}
                        </div>
                      </>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
    );
  }
}

export default OpponentChart;
