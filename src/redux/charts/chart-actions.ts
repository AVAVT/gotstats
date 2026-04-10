import { ThunkDispatch } from "@reduxjs/toolkit";
import { Game } from "@/type/game";
import { MAX_DATE } from "@/utils/constants";
import { getGameBoardSize, getGameHandicapState, getGameTimeSettings } from "@/utils/utils";
import { StoreState } from "../type";
import {
  BoardSizeValues,
  ChartAction,
  ChartState,
  ColorValues,
  colorValues,
  Filter,
  HandicapValues,
  RankedValues,
  ResultTypeValues,
  rankedValues,
  resultTypeValues,
  TimeSettingsValues,
  TournamentValues,
  tournamentValues,
  UPDATE_CHART_DATA_SOURCE,
} from "./type";

const updateChartDataSource = (newData: ChartState) => ({
  type: UPDATE_CHART_DATA_SOURCE,
  payload: newData,
});

export const applyGameFilters =
  (filters?: Filter) => (dispatch: ThunkDispatch<StoreState, void, ChartAction>, getState: () => StoreState) => {
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

    const latestLimitEndDate = filters?.limitEndDate !== undefined ? filters.limitEndDate : limitEndDate;
    const latestEndDate = filters?.endDate !== undefined ? filters.endDate : endDate;

    const newEndDate = latestLimitEndDate
      ? latestEndDate < dateOfLastGame
        ? latestEndDate
        : dateOfLastGame
      : MAX_DATE;

    const filterFunctionParams: Omit<ChartState, "results"> = {
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
      }),
    );
  };

const composeFilterFunction =
  ({
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
  }: Omit<ChartState, "results">) =>
  (game: Game) => {
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

const gameSatisfyRankedRule = (game: Game, ranked: RankedValues[]) => {
  if (game.ranked && !ranked.includes(rankedValues.Ranked)) return false;
  if (!game.ranked && !ranked.includes(rankedValues.Unranked)) return false;
  return true;
};

const gameSatisfyTournamentRule = (game: Game, tournament: TournamentValues[]) => {
  const isTournamentGame = game.tournament !== null;
  if (isTournamentGame && !tournament.includes(tournamentValues.Tournament)) return false;
  if (!isTournamentGame && !tournament.includes(tournamentValues.NonTournament)) return false;
  return true;
};

const gameSatisfyBoardSizeRule = (game: Game, boardSize: BoardSizeValues[]) => {
  const gameSize = getGameBoardSize(game);
  return boardSize.includes(gameSize);
};

const gameSatisfyTimeSettingsRule = (game: Game, timeSettings: TimeSettingsValues[]) => {
  const gameTimeSettings = getGameTimeSettings(game);
  return timeSettings.includes(gameTimeSettings);
};

const gameSatisfyHandicapRule = (game: Game, handicap: HandicapValues[], playerId: number) => {
  const gameHandicapState = getGameHandicapState(game, playerId);
  return handicap.includes(gameHandicapState);
};

const gameSatisfyColorRule = (game: Game, color: ColorValues[], playerId: number) => {
  if (game.players.black.id === playerId && !color.includes(colorValues.Black)) return false;
  if (game.players.white.id === playerId && !color.includes(colorValues.White)) return false;
  return true;
};

const gameSatisfyResultTypeRule = (game: Game, resultType: ResultTypeValues[]) => {
  if (game.outcome === "Resignation") {
    if (resultType.includes(resultTypeValues.Resignation)) return true;
  } else if (game.outcome === "Timeout") {
    if (resultType.includes(resultTypeValues.Timeout)) return true;
  } else if (!Number.isNaN(game.outcome?.split(" ")[0])) {
    if (resultType.includes(resultTypeValues.Scoring)) return true;
  } else {
    if (resultType.includes(resultTypeValues.Others)) return true;
  }

  return false;
};
