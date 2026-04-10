import CancelablePromise from "cancelable-promise";
import { Game } from "@/type/game";
import { FETCH_GAMES_REQUEST, FETCH_GAMES_SUCCESS } from "../games/type";
import { FETCH_PLAYER_REQUEST } from "../player/type";

export const rankedValues = {
  Ranked: "Ranked",
  Unranked: "Unranked",
  values: ["Ranked", "Unranked"],
} as const;

export type RankedValues = (typeof rankedValues.values)[number];

export const tournamentValues = {
  Tournament: "Tournament",
  NonTournament: "Non-tournament",
  values: ["Tournament", "Non-tournament"],
} as const;

export type TournamentValues = (typeof tournamentValues.values)[number];

export const boardSizeValues = {
  Nineteens: "19x19",
  Thirteens: "13x13",
  Nines: "9x9",
  Others: "Others",
  values: ["19x19", "13x13", "9x9", "Others"],
} as const;

export type BoardSizeValues = (typeof boardSizeValues.values)[number];

export const timeSettingsValues = {
  Blitz: "Blitz",
  Live: "Live",
  Correspondence: "Correspondence",
  values: ["Blitz", "Live", "Correspondence"],
} as const;

export type TimeSettingsValues = (typeof timeSettingsValues.values)[number];

export const resultTypeValues = {
  Scoring: "Scoring",
  Resignation: "Resignation",
  Timeout: "Timeout",
  Others: "Others",
  values: ["Scoring", "Resignation", "Timeout", "Others"],
} as const;

export type ResultTypeValues = (typeof resultTypeValues.values)[number];

export const colorValues = {
  Black: "Play as Black",
  White: "Play as White",
  values: ["Play as Black", "Play as White"],
} as const;

export type ColorValues = (typeof colorValues.values)[number];

export const handicapValues = {
  Even: "Even game",
  Taker: "Handicap taker",
  Giver: "Handicap giver",
  values: ["Even game", "Handicap taker", "Handicap giver"],
} as const;

export type HandicapValues = (typeof handicapValues.values)[number];

export interface ChartState {
  startDate: Date;
  endDate: Date;
  limitEndDate: boolean;
  ranked: RankedValues[];
  tournament: TournamentValues[];
  boardSize: BoardSizeValues[];
  timeSettings: TimeSettingsValues[];
  resultType: ResultTypeValues[];
  handicap: HandicapValues[];
  color: ColorValues[];
  results: Game[];
  playerId: number;
}

export type Filter = Partial<Omit<ChartState, "playerId">>;

export const UPDATE_CHART_DATA_SOURCE = "UPDATE_CHART_DATA_SOURCE" as const;

export type ChartAction =
  | {
      type: typeof UPDATE_CHART_DATA_SOURCE;
      payload: ChartState;
    }
  | {
      type: typeof FETCH_GAMES_REQUEST;
      payload: CancelablePromise;
    }
  | {
      type: typeof FETCH_GAMES_SUCCESS;
      payload: {
        results: Game[];
        start: Date;
        end: Date;
      };
    }
  | { type: typeof FETCH_PLAYER_REQUEST; payload: undefined };
