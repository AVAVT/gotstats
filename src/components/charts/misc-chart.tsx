import moment from "moment";
import "moment-precise-range-plugin";
import GameLink from "@/components/shared/game-link";
import PlayerLink from "@/components/shared/player-link";
import { PlayerState } from "@/redux/player/type";
import { Game } from "@/type/game";
import { Player } from "@/type/player";
import { daysDifferenceBetween, extractPlayerAndOpponent, isPlayerWin } from "@/utils/chart-utils";

export interface MiscChartProps {
  title: string;
  id: string;
  games: Game[];
  player: PlayerState;
}

function computeMiscInfo(analyzingGames: Game[], player: PlayerState) {
  let mostActiveDay: Date | undefined;
  let currentDay = new Date();
  currentDay.setHours(0, 0, 0, 0);

  let totalLosses = 0;

  let longestStreak: { streak: number; start?: Game; end?: Game } = { streak: 0 };
  let currentStreak: { streak: number; start?: Game; end?: Game } = { streak: 0 };

  let gamesOnMostActiveDay = 0,
    gamesOnCurrentDay = 0;

  let biggestWin: { diff: number; game?: Game; opponent?: Player } = { diff: 0 };

  let longestGame: { game: Game | null; duration: number } = { game: null, duration: 0 };

  for (const game of analyzingGames) {
    const isWin = isPlayerWin(game, player.id);

    // Longest streak
    if (isWin) {
      currentStreak.streak++;
      currentStreak.start = game;

      if (!currentStreak.end) currentStreak.end = game;

      if (currentStreak.streak > longestStreak.streak) longestStreak = currentStreak;
    } else currentStreak = { streak: 0 };

    // Biggest win
    if (isWin) {
      const { opponent } = extractPlayerAndOpponent(game, player.id);
      if (game.outcome && !Number.isNaN(Number(game.outcome.split(" ")[0]))) {
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
    const gameDay = new Date(game.ended);
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
      const gameDuration = moment.duration(moment(game.ended).diff(moment(game.started))).asMilliseconds();
      if (gameDuration > longestGame.duration) {
        longestGame = {
          game,
          duration: gameDuration,
        };
      }
    }
  }

  let memberSince = new Date(player.registrationDate ?? Date.now());
  // Change memberSince to date of first game for player who migrated from old server
  if (analyzingGames.length) {
    const firstGameDate = new Date(analyzingGames[analyzingGames.length - 1].started);
    if (firstGameDate < memberSince) memberSince = firstGameDate;
  }

  let gamesPerDay = 0;
  if (analyzingGames.length) {
    const dateOfFirstGame = new Date(analyzingGames[analyzingGames.length - 1].started);
    const daysSinceStart = daysDifferenceBetween(new Date(), dateOfFirstGame);
    gamesPerDay = analyzingGames.length / daysSinceStart;
  }

  const uniqueTournaments = analyzingGames
    .filter((game) => game.tournament !== null)
    .reduce((result: number[], game) => {
      if (game.tournament !== null && result.indexOf(game.tournament) === -1) {
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
}

export default function MiscChart({ title, id, games, player }: MiscChartProps) {
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
  } = computeMiscInfo(games, player);

  const streakDurationDisplay =
    longestStreak.start && longestStreak.end ? (
      <span>
        , from <GameLink game={longestStreak.start} /> to <GameLink game={longestStreak.end} />
      </span>
    ) : (
      ""
    );
  const biggestWinDisplay = biggestWin.game && biggestWin.opponent && (
    <li>
      Biggest win: {biggestWin.diff} points victory against <PlayerLink player={biggestWin.opponent} /> on{" "}
      <GameLink game={biggestWin.game} />.
    </li>
  );
  return (
    <section className="stats_block">
      <h2 id={id} className="text-center">
        {title}
      </h2>
      <ul className="info_list list-disc pl-4">
        <li>Member since: {moment(memberSince).format("DD MMM, YYYY")}.</li>
        <li>Plays {gamesPerDay.toFixed(3)} games per day on average.</li>
        <li>
          Most active day: {moment(mostActiveDay).format("DD MMM, YYYY")} with {gamesOnMostActiveDay} finished games.
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
            {moment.preciseDiff(moment(longestGame.ended), moment(longestGame.started))}
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
