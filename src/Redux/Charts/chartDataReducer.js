import { resultTypeValues, UPDATE_CHART_DATA_SOURCE } from "./chartActions";
import { FETCH_GAMES } from "../Games/gameActions";
import { FETCH_PLAYER } from "../Player/playerActions";

import { REQUEST, SUCCESS } from "../promiseUtils";

import {
  rankedValues,
  tournamentValues,
  boardSizeValues,
  timeSettingsValues,
  colorValues,
  handicapValues,
} from "./chartActions";

import { minDate, maxDate } from "../../Shared/constants";

const initialState = {
  startDate: minDate,
  endDate: maxDate,
  ranked: rankedValues.values,
  tournament: tournamentValues.values,
  boardSize: boardSizeValues.values,
  timeSettings: timeSettingsValues.values,
  handicap: handicapValues.values,
  color: colorValues.values,
  resultType: resultTypeValues.values,
  limitEndDate: false,
  results: [],
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE_CHART_DATA_SOURCE:
      return {
        ...state,
        ...payload,
      };

    case REQUEST(FETCH_GAMES):
    case REQUEST(FETCH_PLAYER):
      return {
        ...initialState,
      };

    case SUCCESS(FETCH_GAMES):
      return {
        ...state,
        startDate: payload.start,
      };
    default:
      return state;
  }
};

export default reducer;
