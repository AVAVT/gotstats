import { format } from "date-fns";
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

export type WinStreak = {
  streak: number;
  start: Game;
  end: Game;
};

const MIN_WIN_STREAK_LENGTH = 4;

export const getLongestWinStreak = (games: Game[], playerId: number): WinStreak | null => {
  let longestStreak = { streak: 0, start: null as Game | null, end: null as Game | null };
  let currentStreak = { streak: 0, start: null as Game | null, end: null as Game | null };

  for (const game of games) {
    if (isPlayerWin(game, playerId)) {
      currentStreak = {
        streak: currentStreak.streak + 1,
        start: game,
        end: currentStreak.end ?? game,
      };

      if (currentStreak.streak > longestStreak.streak) {
        longestStreak = currentStreak;
      }
      continue;
    }

    currentStreak = { streak: 0, start: null, end: null };
  }

  if (longestStreak.streak < MIN_WIN_STREAK_LENGTH || !longestStreak.start || !longestStreak.end) {
    return null;
  }

  return {
    streak: longestStreak.streak,
    start: longestStreak.start,
    end: longestStreak.end,
  };
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

export const getOpponent = (game: Game, playerId: number) => extractPlayerAndOpponent(game, playerId).opponent;

export type OpponentGameStats = {
  opponent: Player;
  games: number;
  win: number;
  loss: number;
};

export const getOpponentGameStats = (games: Game[], playerId: number): OpponentGameStats[] => {
  const opponents = new Map<number, OpponentGameStats>();

  for (const game of games) {
    const opponent = getOpponent(game, playerId);
    const isWin = isPlayerWin(game, playerId);
    const existing = opponents.get(opponent.id);

    if (existing) {
      existing.games++;
      if (isWin) {
        existing.win++;
      } else {
        existing.loss++;
      }
      continue;
    }

    opponents.set(opponent.id, {
      opponent,
      games: 1,
      win: isWin ? 1 : 0,
      loss: isWin ? 0 : 1,
    });
  }

  return Array.from(opponents.values()).sort((left, right) => right.games - left.games);
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

const getHistoricalPlayerRatings = (game: Game, playerId: number) => {
  return game.players.black.id === playerId
    ? game.historical_ratings.black.ratings
    : game.historical_ratings.white.ratings;
};

const getFirstRankedGameBefore = (games: Game[], targetGame: Game | null) => {
  if (!targetGame) return null;

  const targetIndex = games.findIndex((game) => game.id === targetGame.id);
  if (targetIndex < 0 || targetIndex === games.length - 1) return null;

  for (let i = targetIndex + 1; i < games.length; i++) {
    if (games[i].ranked) {
      return games[i];
    }
  }

  return null;
};

export const getHighestRatingAchieved = (analyzingGames: Game[], playerId: number) => {
  let ratingDetectedIn: Game | null = null;
  let ratings = { overall: { rating: 0 } };

  for (let i = analyzingGames.length - 1; i >= 0; i--) {
    const game = analyzingGames[i];
    const gameRatings = getHistoricalPlayerRatings(game, playerId);

    if (gameRatings.overall.rating > ratings.overall.rating) {
      ratings = gameRatings;
      ratingDetectedIn = game;
    }
  }

  return {
    game: getFirstRankedGameBefore(analyzingGames, ratingDetectedIn),
    ratings,
    rating: ratings.overall.rating,
    ratingDetectedIn,
  };
};

export const getHighestRankAchieved = (analyzingGames: Game[], playerId: number) => {
  const r = getHighestRatingAchieved(analyzingGames, playerId);
  return {
    game: r.game,
    ratings: r.ratings,
  };
};

export const toDateInputValue = (date: Date | number) => format(date, "yyyy-MM-dd");
