export const rankNumberToKyuDan = (rank) => {
  if (rank < 28)
    return (28 - rank) + "k";
  else
    return (rank - 27) + "d";
}