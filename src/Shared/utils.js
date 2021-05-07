const rankNumberToKyuDan = (rank) => {
  if (rank < 30) return 30 - rank + "k";
  else return rank - 29 + "d";
};

export const getPlayerRank = (player) => {
  try {
    const rating = player.ratings.overall.rating;
    var rank = Math.floor(ratingToRank(rating));
    return rank;
  } catch (err) {
    return player.ranking;
  }
};

export const getPlayerUnroundedRank = (player) => {
  try {
    const rating = player.ratings.overall.rating;
    var rank = ratingToRank(rating);
    return rank;
  } catch (err) {
    return player.ranking;
  }
};

export const getPlayerRating = (player) => player.ratings.overall.rating;

export const getPlayerRankDisplay = (player) => {
  return rankNumberToKyuDan(getPlayerRank(player));
};

export const ratingToRank = (rating) => Math.log(rating / 525) * 23.15;

export const ratingToKyuDan = (rating) => {
  var rank = Math.floor(ratingToRank(rating));
  return rankNumberToKyuDan(rank);
};

export const getGameBoardSize = (game) => {
  if (game.width === 19 && game.height === 19) return "19x19";
  else if (game.width === 13 && game.height === 13) return "13x13";
  else if (game.width === 9 && game.height === 9) return "9x9";
  else return "Others";
};

export const getGameTimeSettings = (game) => {
  if (game.time_per_move < 20) return "Blitz";
  else if (game.time_per_move > 10800) return "Correspondence";
  else return "Live";
};

export const getGameHandicapState = (game, playerId) => {
  if (game.handicap === 0) return "Even game";
  else if (game.players.black.id === playerId) return "Handicap taker";
  else return "Handicap giver";
};

export const isPlayerWin = (game, playerId) => {
  return (
    (game.players.black.id === playerId && game.white_lost) ||
    (game.players.white.id === playerId && game.black_lost)
  );
};

export const extractPlayerAndOpponent = (game, playerId) => {
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

export const extractHistoricalPlayerAndOpponent = (game, playerId) => {
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

export const daysDifferenceBetween = (day1, day2) => {
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
