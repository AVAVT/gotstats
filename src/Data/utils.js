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