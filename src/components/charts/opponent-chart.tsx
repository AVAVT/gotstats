import Image from "next/image";
import { Fragment } from "react";
import { OGS_API_PLAYER_ROOT, OGS_ROOT } from "@/api/api-constants";
import GameLink from "@/components/shared/game-link";
import PlayerLink from "@/components/shared/player-link";
import { PlayerState } from "@/redux/player/type";
import { Game } from "@/type/game";
import { Player } from "@/type/player";
import {
  extractHistoricalPlayerAndOpponent,
  extractPlayerAndOpponent,
  getOpponentGameStats,
  getPlayerRank,
  getPlayerRankDisplay,
  getPlayerRating,
  isPlayerWin,
} from "@/utils/chart-utils";

export interface OpponentChartProps {
  title: string;
  id: string;
  games: Game[];
  player: PlayerState;
}

interface OpponentRecord {
  opponent: Player;
  rank: number;
  games: number;
  win: number;
  loss: number;
}

const MIN_GAMES_COUNT_FOR_REGULAR = 4;

function computeOpponentsInfo(games: Game[], player: PlayerState) {
  const opponentStats = getOpponentGameStats(games, player.id);
  var numberOfOpponents = 0;
  var weakestOpp: { rank: number; id?: number; username?: string; ratings?: Player["ratings"]; ranking?: number } = {
    rank: 70,
  };
  var strongestOpp: { rank: number; id?: number; username?: string; ratings?: Player["ratings"]; ranking?: number } = {
    rank: 0,
  };
  var mostPlayed: { games: number; id?: number; username?: string; ratings?: Player["ratings"]; ranking?: number } = {
    games: 0,
  };
  var strongestDefeated: {
    ratingDiff: number;
    game?: Game;
    username?: string;
    id?: number;
    ratings?: Player["ratings"];
    ranking?: number;
  } = { ratingDiff: -9999 };

  for (const game of games) {
    const isWin = isPlayerWin(game, player.id);

    const { opponent } = extractPlayerAndOpponent(game, player.id);
    const { historicalOpponent, historicalPlayer } = extractHistoricalPlayerAndOpponent(game, player.id);
    const opponentRank = getPlayerRank(opponent);

    if (isWin) {
      const ratingDiff =
        getPlayerRating(opponent) -
        getPlayerRating(player as never) +
        getPlayerRating(historicalOpponent) -
        getPlayerRating(historicalPlayer);
      if (ratingDiff > strongestDefeated.ratingDiff)
        strongestDefeated = {
          ...opponent,
          ratingDiff,
          game,
        };
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

  if (opponentStats.length > 0) {
    const mostPlayerOpp = opponentStats[0];
    mostPlayed = {
      ...mostPlayerOpp.opponent,
      games: mostPlayerOpp.games,
    };
  }

  const recurringOpponents: OpponentRecord[] = opponentStats
    .filter((opponent) => opponent.games >= MIN_GAMES_COUNT_FOR_REGULAR)
    .map((opponent) => ({
      ...opponent,
      rank: getPlayerRank(opponent.opponent),
    }));

  numberOfOpponents = opponentStats.length;

  return {
    strongestOpp,
    weakestOpp,
    mostPlayed,
    strongestDefeated,
    numberOfOpponents,
    recurringOpponents,
    averageGamePerOpponent: (games.length / numberOfOpponents).toFixed(2),
  };
}

function generateChartData(games: Game[], player: PlayerState) {
  const opponentsInfo = computeOpponentsInfo(games, player);

  // OGS data allow up to 30k but realistically no one's below 25k on OGS. Subtract 5 so 25k is at leftmost
  const weakestBarRate = Math.max(opponentsInfo.weakestOpp.rank, 0) - 5;
  const strongestBarRate = Math.min(opponentsInfo.strongestOpp.rank, 42) - 5;
  const userBarRate = getPlayerRank(player as never) - 5;

  return {
    numberOfOpponents: opponentsInfo.numberOfOpponents,
    weakestDisp: {
      href: `${OGS_ROOT}user/view/${opponentsInfo.weakestOpp.id}/${opponentsInfo.weakestOpp.username}`,
      title: `${opponentsInfo.weakestOpp.username} (${getPlayerRankDisplay(opponentsInfo.weakestOpp as never)})`,
      style: { left: `${weakestBarRate * 3.03030303}%` },
      img: `${OGS_API_PLAYER_ROOT}${opponentsInfo.weakestOpp.id}/icon?size=32`,
    },
    userDisp: {
      href: `${OGS_ROOT}user/view/${player.id}/${player.username}`,
      title: `${player.username} (${getPlayerRankDisplay(player as never)})`,
      style: { left: `${userBarRate * 3.03030303}%` },
      img: `${OGS_API_PLAYER_ROOT}${player.id}/icon?size=32`,
    },
    strongestDisp: {
      href: `${OGS_ROOT}user/view/${opponentsInfo.strongestOpp.id}/${opponentsInfo.strongestOpp.username}`,
      title: `${opponentsInfo.strongestOpp.username} (${getPlayerRankDisplay(opponentsInfo.strongestOpp as never)})`,
      style: { left: `${strongestBarRate * 3.03030303}%` },
      img: `${OGS_API_PLAYER_ROOT}${opponentsInfo.strongestOpp.id}/icon?size=32`,
    },
    mostPlayedDisp: opponentsInfo.mostPlayed as Player & { games: number },
    strongestDefeatedDisp: opponentsInfo.strongestDefeated,
    averageGamePerOpponent: opponentsInfo.averageGamePerOpponent,
    recurringOpponents: opponentsInfo.recurringOpponents,
  };
}

export default function OpponentChart({ title, id, games, player }: OpponentChartProps) {
  const {
    numberOfOpponents,
    weakestDisp,
    userDisp,
    strongestDisp,
    mostPlayedDisp,
    strongestDefeatedDisp,
    averageGamePerOpponent,
    recurringOpponents,
  } = generateChartData(games, player);

  if (!numberOfOpponents) return <section className="stats_block" />;

  return (
    <section className="stats_block">
      <h2 id={id} className="text-center">
        {title}: {numberOfOpponents}
      </h2>

      <div id="opponents_polars_chart" className="mt-10 w-[70%] mx-auto">
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
            <Image width={32} height={32} src={weakestDisp.img} alt={weakestDisp.title} />
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
            <Image width={32} height={32} src={userDisp.img} alt={userDisp.title} />
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
            <Image width={32} height={32} src={strongestDisp.img} alt={strongestDisp.title} />
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

      <ul className="info_list pl-4">
        <li>
          Most played with: <PlayerLink player={mostPlayedDisp as Player} /> in{" "}
          {(mostPlayedDisp as Player & { games: number }).games} games.
        </li>
        {!!strongestDefeatedDisp.username && strongestDefeatedDisp.game && (
          <li>
            Strongest defeated opponent: <PlayerLink player={strongestDefeatedDisp as unknown as Player} /> on{" "}
            <GameLink game={strongestDefeatedDisp.game} />.
          </li>
        )}
        <li>Average game per opponent: {averageGamePerOpponent} games.</li>
        {recurringOpponents.length > 0 && (
          <li>
            Regulars ({MIN_GAMES_COUNT_FOR_REGULAR}+ games played):
            <div className="recurring-opponent-list mt-2 -ml-4">
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
                <Fragment key={opp.opponent.id}>
                  <div
                    className="px-3 py-2"
                    style={{
                      background: index % 2 === 0 ? "rgba(0,0,0,0.3)" : "transparent",
                    }}
                  >
                    {opp.games}
                  </div>
                  <div
                    className="px-3 py-2 text-right"
                    style={{
                      background: index % 2 === 0 ? "rgba(0,0,0,0.3)" : "transparent",
                    }}
                  >
                    {((100 * opp.win) / (opp.win + opp.loss)).toFixed(2)}%
                  </div>
                  <div
                    className="px-3 py-2"
                    style={{
                      background: index % 2 === 0 ? "rgba(0,0,0,0.3)" : "transparent",
                    }}
                  >
                    <PlayerLink player={opp.opponent} />
                  </div>
                  <div
                    className="px-3 py-2"
                    style={{
                      background: index % 2 === 0 ? "rgba(0,0,0,0.3)" : "transparent",
                    }}
                  >
                    {opp.win}
                  </div>
                  <div
                    className="px-3 py-2"
                    style={{
                      background: index % 2 === 0 ? "rgba(0,0,0,0.3)" : "transparent",
                    }}
                  >
                    {opp.loss}
                  </div>
                </Fragment>
              ))}
            </div>
          </li>
        )}
      </ul>
    </section>
  );
}
