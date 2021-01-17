import {
  getGameBoardSize,
  getGameTimeSettings,
  getGameHandicapState,
} from "../../Shared/utils";

import { maxDate } from "../../Shared/constants";

export const UPDATE_CHART_DATA_SOURCE = "UPDATE_CHART_DATA_SOURCE";

export const rankedValues = {
  Ranked: "Ranked",
  Unranked: "Unranked",
  values: ["Ranked", "Unranked"],
};
export const tournamentValues = {
  Tournament: "Tournament",
  NonTournament: "Non-tournament",
  values: ["Tournament", "Non-tournament"],
};
export const boardSizeValues = {
  Nineteens: "19x19",
  Thirteens: "13x13",
  Nines: "9x9",
  Others: "Others",
  values: ["19x19", "13x13", "9x9", "Others"],
};
export const timeSettingsValues = {
  Blitz: "Blitz",
  Live: "Live",
  Correspondence: "Correspondence",
  values: ["Blitz", "Live", "Correspondence"],
};
export const resultTypeValues = {
  Scoring: "Scoring",
  Resignation: "Resignation",
  Timeout: "Timeout",
  Others: "Others",
  values: ["Scoring", "Resignation", "Timeout", "Others"],
};
export const colorValues = {
  Black: "Play as Black",
  White: "Play as White",
  values: ["Play as Black", "Play as White"],
};
export const handicapValues = {
  Even: "Even game",
  Taker: "Handicap taker",
  Giver: "Handicap giver",
  values: ["Even game", "Handicap taker", "Handicap giver"],
};

export const applyGameFilters = (filters) => (dispatch, getState) => {
  const playerId = getState().player.id;
  const dateOfLastGame = getState().games.end;

  const {
    startDate,
    endDate,
    ranked,
    tournament,
    boardSize,
    timeSettings,
    resultType,
    handicap,
    color,
    limitEndDate,
  } = getState().chartsData;

  const latestLimitEndDate =
    filters && filters.hasOwnProperty("limitEndDate")
      ? filters.limitEndDate
      : limitEndDate;
  const latestEndDate =
    filters && filters.hasOwnProperty("endDate") ? filters.endDate : endDate;

  const newEndDate = latestLimitEndDate
    ? latestEndDate < dateOfLastGame
      ? latestEndDate
      : dateOfLastGame
    : maxDate;

  const filterFunctionParams = {
    startDate,
    ranked,
    tournament,
    boardSize,
    timeSettings,
    handicap,
    color,
    playerId,
    limitEndDate,
    resultType,
    ...filters,
    endDate: newEndDate,
  };

  const filterFunction = composeFilterFunction(filterFunctionParams);

  dispatch(
    updateChartDataSource({
      ...filterFunctionParams,
      results: getState().games.results.filter(filterFunction),
    })
  );
};

const composeFilterFunction = ({
  startDate,
  endDate,
  ranked,
  tournament,
  boardSize,
  timeSettings,
  handicap,
  resultType,
  color,
  playerId,
}) => (game, index) => {
  const date = new Date(game.ended);
  if (date < startDate || date > endDate) return false;

  return (
    gameSatisfyRankedRule(game, ranked) &&
    gameSatisfyTournamentRule(game, tournament) &&
    gameSatisfyBoardSizeRule(game, boardSize) &&
    gameSatisfyTimeSettingsRule(game, timeSettings) &&
    gameSatisfyHandicapRule(game, handicap, playerId) &&
    gameSatisfyColorRule(game, color, playerId) &&
    gameSatisfyResultTypeRule(game, resultType)
  );
};

const gameSatisfyRankedRule = (game, ranked) => {
  if (game.ranked && !ranked.includes(rankedValues.Ranked)) return false;
  if (!game.ranked && !ranked.includes(rankedValues.Unranked)) return false;
  return true;
};

const gameSatisfyTournamentRule = (game, tournament) => {
  const isTournamentGame = game.tournament !== null;
  if (isTournamentGame && !tournament.includes(tournamentValues.Tournament))
    return false;
  if (!isTournamentGame && !tournament.includes(tournamentValues.NonTournament))
    return false;
  return true;
};

const gameSatisfyBoardSizeRule = (game, boardSize) => {
  const gameSize = getGameBoardSize(game);
  return boardSize.includes(gameSize);
};

const gameSatisfyTimeSettingsRule = (game, timeSettings) => {
  const gameTimeSettings = getGameTimeSettings(game);
  return timeSettings.includes(gameTimeSettings);
};

const gameSatisfyHandicapRule = (game, handicap, playerId) => {
  const gameHandicapState = getGameHandicapState(game, playerId);
  return handicap.includes(gameHandicapState);
};

const gameSatisfyColorRule = (game, color, playerId) => {
  if (game.players.black.id === playerId && !color.includes(colorValues.Black))
    return false;
  if (game.players.white.id === playerId && !color.includes(colorValues.White))
    return false;
  return true;
};

const gameSatisfyResultTypeRule = (game, resultType) => {
  if (game.outcome === "Resignation") {
    if (resultType.includes(resultTypeValues.Resignation)) return true;
  } else if (game.outcome === "Timeout") {
    if (resultType.includes(resultTypeValues.Timeout)) return true;
  } else if (!isNaN(game.outcome.split(" ")[0])) {
    if (resultType.includes(resultTypeValues.Scoring)) return true;
  } else {
    if (resultType.includes(resultTypeValues.Others)) return true;
  }

  return false;
};

const updateChartDataSource = (newData) => ({
  type: UPDATE_CHART_DATA_SOURCE,
  payload: newData,
});
