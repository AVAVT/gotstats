import { Game } from "@/type/game";
import { Player } from "@/type/player";

const rankNumberToKyuDan = (rank: number) => {
  if (rank < 30) return `${30 - rank}k`;
  else return `${rank - 29}d`;
};

export const getPlayerRank = (player: { ratings: { overall: { rating: number } }; ranking?: number }) => {
  try {
    const rating = player.ratings.overall.rating;
    return Math.floor(ratingToRank(rating));
  } catch {
    return player?.ranking ?? 0;
  }
};

export const getPlayerUnroundedRank = (player: Player) => {
  try {
    const rating = player.ratings.overall.rating;
    return ratingToRank(rating);
  } catch {
    return player.ranking;
  }
};

export const getPlayerRating = (player: { ratings: { overall: { rating: number } } }) => player.ratings.overall.rating;

export const getPlayerRankDisplay = (player: { ratings: { overall: { rating: number } }; ranking?: number }) => {
  return rankNumberToKyuDan(getPlayerRank(player));
};

export const ratingToRank = (rating: number) => Math.log(rating / 525) * 23.15;

export const ratingToKyuDan = (rating: number) => {
  var rank = Math.floor(ratingToRank(rating));
  return rankNumberToKyuDan(rank);
};

export const getGameBoardSize = (game: Game) => {
  if (game.width === 19 && game.height === 19) return "19x19";
  else if (game.width === 13 && game.height === 13) return "13x13";
  else if (game.width === 9 && game.height === 9) return "9x9";
  else return "Others";
};

export const BLITZ_TIME_PER_MOVE = 20;
export const CORR_TIME_PER_MOVE = 10800;

export const getGameTimeSettings = (game: Game) => {
  if (game.time_per_move < BLITZ_TIME_PER_MOVE) return "Blitz";
  else if (game.time_per_move > CORR_TIME_PER_MOVE) return "Correspondence";
  else return "Live";
};

export const getGameHandicapState = (game: Game, playerId: number) => {
  if (game.handicap === 0) return "Even game";
  else if (game.players.black.id === playerId) return "Handicap taker";
  else return "Handicap giver";
};

export const isPlayerWin = (game: Game, playerId: number) => {
  return (
    (game.players.black.id === playerId && game.white_lost) || (game.players.white.id === playerId && game.black_lost)
  );
};

export const extractPlayerAndOpponent = (game: Game, playerId: number) => {
  return game.players.black.id === playerId
    ? {
        player: game.players.black,
        opponent: game.players.white,
      }
    : {
        player: game.players.white,
        opponent: game.players.black,
      };
};

export const extractHistoricalPlayerAndOpponent = (game: Game, playerId: number) => {
  return game.players.black.id === playerId
    ? {
        historicalPlayer: game.historical_ratings.black,
        historicalOpponent: game.historical_ratings.white,
      }
    : {
        historicalPlayer: game.historical_ratings.white,
        historicalOpponent: game.historical_ratings.black,
      };
};

export const getHighestRankAchieved = (analyzingGames: Game[], playerId: number) => {
  const games = [...analyzingGames].reverse();
  const r = games.reduce<{ game: Game | null; previousGame: Game | null; ratings: { overall: { rating: number } } }>(
    (result, game) => {
      if (!game) return result;
      const newRating =
        game.players.black.id === playerId
          ? game.historical_ratings.black.ratings
          : game.historical_ratings.white.ratings;

      const shouldUpdate = newRating.overall.rating > result.ratings.overall.rating;

      result.game = shouldUpdate ? result.previousGame : result.game;
      result.previousGame = game;
      result.ratings = shouldUpdate ? newRating : result.ratings;

      return result;
    },
    {
      game: null,
      previousGame: null,
      ratings: { overall: { rating: 0 } },
    },
  );
  return {
    game: r.game,
    ratings: r.ratings,
  };
};

export const daysDifferenceBetween = (day1: Date, day2: Date) => {
  /* Copa pasta I don't even know if there's any bug here */

  // Copy date parts of the timestamps, discarding the time parts.
  var two = new Date(day1.getFullYear(), day1.getMonth(), day1.getDate());
  var one = new Date(day2.getFullYear(), day2.getMonth(), day2.getDate());

  // Do the math.
  var millisecondsPerDay = 1000 * 60 * 60 * 24;
  var millisBetween = two.getTime() - one.getTime();
  var days = millisBetween / millisecondsPerDay;

  // Round down.
  return two > one ? Math.floor(days) : Math.ceil(days);
};
