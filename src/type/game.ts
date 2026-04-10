import { Player } from "./player";

export type Game = {
  related: {
    detail: string;
  };
  players: {
    black: Player;
    white: Player;
  };
  id: number;
  name: string;
  creator: number;
  mode: string;
  source: string;
  black: number;
  white: number;
  width: number;
  height: number;
  rules: string;
  ranked: boolean;
  handicap_rank_difference: string | null;
  handicap: number;
  komi: string;
  time_control: string;
  black_player_rank: number;
  black_player_rating: string;
  white_player_rank: number;
  white_player_rating: string;
  time_per_move: number;
  time_control_parameters: string;
  disable_analysis: boolean;
  tournament: number | null;
  tournament_round: number;
  ladder: number | null;
  pause_on_weekends: boolean;
  outcome: string | null;
  black_lost: boolean;
  white_lost: boolean;
  annulled: boolean;
  started: string;
  ended: string;
  sgf_filename: string | null;
  historical_ratings: {
    black: Player;
    white: Player;
  };
  rengo: boolean;
  rengo_black_team: number[] | null;
  rengo_white_team: number[] | null;
  rengo_casual_mode: boolean;
  flags: null;
  bot_detection_results: null;
  bot_parameters: null;
};
