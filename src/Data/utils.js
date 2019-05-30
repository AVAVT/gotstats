const rankNumberToKyuDan = (rank) => {
  if (rank < 30)
    return (30 - rank) + "k";
  else
    return (rank - 29) + "d";
}

export const getPlayerRank = (player) => {
  try {
    const rating = player.ratings.overall.rating
    var rank = Math.floor(
      Math.log(rating / 850.0) / 0.032
    );
    return rank;
  }
  catch (err) {
    return player.ranking;
  }
}

export const getPlayerRankDisplay = (player) => {
  return rankNumberToKyuDan(getPlayerRank(player));
}

export const getGameBoardSize = (game) => {
  if (game.width === 19 && game.height === 19) return "19x19";
  else if (game.width === 13 && game.height === 13) return "13x13";
  else if (game.width === 9 && game.height === 9) return "9x9";
  else return "Others";
}

export const getGameTimeSettings = (game) => {
  if (game.time_per_move < 20) return "Blitz";
  else if (game.time_per_move > 10800) return "Correspondence";
  else return "Live"
}

export const getGameHandicapState = (game, playerId) => {
  if (game.handicap === 0) return "Even game";
  else if (game.players.black.id === playerId) return "Handicap taker";
  else return "Handicap giver";
}