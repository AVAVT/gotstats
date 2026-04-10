import { ChartState } from "./charts/type";
import { GameState } from "./games/type";
import { PlayerState } from "./player/type";

export type StoreState = {
  player: PlayerState;
  games: GameState;
  chartsData: ChartState;
};
