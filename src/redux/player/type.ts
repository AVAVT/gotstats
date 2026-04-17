import CancelablePromise from "cancelable-promise";

export const FETCH_PLAYER = "FETCH_PLAYER";
export const FETCH_PLAYER_REQUEST = "FETCH_PLAYER_PENDING" as const;
export const FETCH_PLAYER_FAILURE = "FETCH_PLAYER_REJECTED" as const;
export const FETCH_PLAYER_SUCCESS = "FETCH_PLAYER_FULFILLED" as const;

export type PlayerState = {
  id: number;
  username: string;
  ratings: {
    version?: number;
    overall: {
      rating: number;
      deviation?: number;
      valtility?: number;
    };
  };
  rank: number;
  fetching: CancelablePromise | null;
  fetchError: string;
  registrationDate: Date | null;
};

export type PlayerAction =
  | {
      type: typeof FETCH_PLAYER_REQUEST;
      payload: CancelablePromise;
    }
  | {
      type: typeof FETCH_PLAYER_SUCCESS;
      payload: Partial<PlayerState>;
    }
  | {
      type: typeof FETCH_PLAYER_FAILURE;
      payload: { error: string };
    };
