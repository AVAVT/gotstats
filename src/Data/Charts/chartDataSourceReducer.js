import { UPDATE_CHART_DATA_SOURCE } from "./chartActions";
import { FETCH_GAMES_START, FETCH_GAMES_SUCCESS } from "../Games/gameActions";
import { FETCH_PLAYER_START } from '../Player/playerActions';

import {
  minDate,
  maxDate,
  rankedValues,
  tournamentValues,
  boardSizeValues,
  timeSettingsValues,
  colorValues,
  handicapValues
} from "./chartActions";

const initialState = {
  startDate: minDate,
  endDate: maxDate,
  ranked: rankedValues.values,
  tournament: tournamentValues.values,
  boardSize: boardSizeValues.values,
  timeSettings: timeSettingsValues.values,
  handicap: handicapValues.values,
  color: colorValues.values,
  results: []
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE_CHART_DATA_SOURCE: return {
      ...state,
      ...payload
    };

    case FETCH_GAMES_START:
    case FETCH_PLAYER_START:
      return {
        ...initialState
      };

    case FETCH_GAMES_SUCCESS:
      return {
        ...state,
        startDate: payload.start
      }
    default: return state;
  }
}

export default reducer;