import { combineReducers } from "redux";
import playerReducer from "./Player/playerReducer";
import gamesReducer from "./Games/gameReducer";
import chartReducers from "./Charts/chartDataReducer";
import APIReducer from "./APIReducer";

export default combineReducers({
  OGSApi: APIReducer,
  player: playerReducer,
  games: gamesReducer,
  chartsData: chartReducers
});
