import { MAX_DATE, MIN_DATE } from "@/utils/constants";
import { FETCH_GAMES_REQUEST, FETCH_GAMES_SUCCESS } from "../games/type";
import { FETCH_PLAYER_REQUEST } from "../player/type";
import {
  boardSizeValues,
  ChartAction,
  colorValues,
  handicapValues,
  rankedValues,
  resultTypeValues,
  timeSettingsValues,
  tournamentValues,
  UPDATE_CHART_DATA_SOURCE,
} from "./type";

const initialState = {
  startDate: MIN_DATE,
  endDate: MAX_DATE,
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

const reducer = (state = initialState, { type, payload }: ChartAction) => {
  switch (type) {
    case UPDATE_CHART_DATA_SOURCE:
      return {
        ...state,
        ...payload,
      };

    case FETCH_GAMES_REQUEST:
    case FETCH_PLAYER_REQUEST:
      return {
        ...initialState,
      };

    case FETCH_GAMES_SUCCESS:
      return {
        ...state,
        startDate: payload.start,
      };
    default:
      return state;
  }
};

export default reducer;
