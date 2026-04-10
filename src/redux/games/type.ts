import CancelablePromise from "cancelable-promise";
import { Game } from "@/type/game";
import { FETCH_PLAYER_REQUEST } from "../player/type";

export const FETCH_GAMES = "FETCH_GAMES";
export const FETCH_GAMES_REQUEST = "FETCH_GAMES_PENDING" as const;
export const FETCH_GAMES_PROGRESS = "FETCH_GAMES_PROGRESS" as const;
export const FETCH_GAMES_FAILURE = "FETCH_GAMES_REJECTED" as const;
export const FETCH_GAMES_SUCCESS = "FETCH_GAMES_FULFILLED" as const;

export type GameState = {
  results: Game[];
  fetching: CancelablePromise | null;
  fetchingPage: number;
  fetchingTotalPage: number;
  fetchError: string;
  start: Date;
  end: Date;
};

export type GameAction =
  | {
      type: typeof FETCH_GAMES_REQUEST;
      payload: CancelablePromise;
    }
  | {
      type: typeof FETCH_GAMES_FAILURE;
      payload: { error: string };
    }
  | {
      type: typeof FETCH_GAMES_PROGRESS;
      payload: { fetching: CancelablePromise; fetchingPage: number; fetchingTotalPage: number; results: Game[] };
    }
  | {
      type: typeof FETCH_GAMES_SUCCESS;
      payload: {
        results: Game[];
        start: Date;
        end: Date;
      };
    }
  | {
      type: typeof FETCH_PLAYER_REQUEST;
      payload: undefined;
    };
