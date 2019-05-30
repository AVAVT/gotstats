import {
  getGameBoardSize,
  getGameTimeSettings,
  getGameHandicapState
} from "../utils";

export const UPDATE_CHART_DATA_SOURCE = "UPDATE_CHART_DATA_SOURCE";

export const RANKED = "Ranked";
export const UNRANKED = "Unranked";

export const rankedValues = ["Ranked", "Unranked"]
export const tournamentValues = ["Tournament", "Non-tournament"]
export const boardSizeValues = ["19x19", "13x13", "9x9", "Others"]
export const timeSettingsValues = ["Blitz", "Live", "Correspondence"]
export const colorValues = ["Play as Black", "Play as White"]
export const handicapValues = ["Even game", "Handicap giver", "Handicap taker"]

export const minDate = new Date(-8640000000000000);
export const maxDate = new Date(8640000000000000);

const defaultActionParams = {
  startDate: minDate,
  endDate: maxDate,
  ranked: rankedValues,
  tournament: tournamentValues,
  boardSize: boardSizeValues,
  timeSettings: timeSettingsValues,
  handicap: handicapValues,
  color: colorValues
}

export const applyGameFilters = ({
  startDate = minDate,
  endDate = maxDate,
  ranked = rankedValues,
  tournament = tournamentValues,
  boardSize = boardSizeValues,
  timeSettings = timeSettingsValues,
  handicap = handicapValues,
  color = colorValues
} = defaultActionParams) => (dispatch, getState) => {
  const playerId = getState().player.id;
  const params = {
    startDate,
    endDate,
    ranked,
    tournament,
    boardSize,
    timeSettings,
    handicap,
    color,
    playerId
  };
  const filterFunction = composeFilterFunction(params);
  dispatch(
    updateChartDataSource({
      ...params,
      results: getState().games.results
        .filter(filterFunction)
    })
  )
}

const composeFilterFunction = ({
  startDate,
  endDate,
  ranked,
  tournament,
  boardSize,
  timeSettings,
  handicap,
  color,
  playerId
}) => (game, index) => {

  const date = new Date(game.ended);
  if (date < startDate || date > endDate) return false;

  return gameSatisfyRankedRule(game, ranked)
    && gameSatisfyTournamentRule(game, tournament)
    && gameSatisfyBoardSizeRule(game, boardSize)
    && gameSatisfyTimeSettingsRule(game, timeSettings)
    && gameSatisfyHandicapRule(game, handicap, playerId)
    && gameSatisfyColorRule(game, color, playerId);
}

const gameSatisfyRankedRule = (game, ranked) => {
  if (game.ranked && !ranked.includes("Ranked")) return false;
  if (!game.ranked && !ranked.includes("Unranked")) return false;
  return true;
}

const gameSatisfyTournamentRule = (game, tournament) => {
  const isTournamentGame = game.tournament !== null;
  if (isTournamentGame && !tournament.includes("Tournament")) return false;
  if (!isTournamentGame && !tournament.includes("Non-tournament")) return false;
  return true;
}

const gameSatisfyBoardSizeRule = (game, boardSize) => {
  const gameSize = getGameBoardSize(game);
  return boardSize.includes(gameSize);
}

const gameSatisfyTimeSettingsRule = (game, timeSettings) => {
  const gameTimeSettings = getGameTimeSettings(game);
  return timeSettings.includes(gameTimeSettings);
}

const gameSatisfyHandicapRule = (game, handicap, playerId) => {
  const gameHandicapState = getGameHandicapState(game, playerId);
  return handicap.includes(gameHandicapState);
}

const gameSatisfyColorRule = (game, color, playerId) => {
  if (game.players.black.id === playerId && !color.includes("Play as Black")) return false;
  if (game.players.white.id === playerId && !color.includes("Play as White")) return false;
  return true;
}

const updateChartDataSource = (newData) => ({
  type: UPDATE_CHART_DATA_SOURCE,
  payload: newData
});