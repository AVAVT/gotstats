import { Game } from "./game";

export type PlayerRecord = {
  id: number;
  exporterVersion: number;
  player: {
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
    registrationDate: Date | null;
  };
  games: {
    start: Date;
    end: Date;
    results: Game[];
  };
};
