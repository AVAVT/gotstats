export type Player = {
  id: number;
  username: string;
  country: string;
  icon: string;
  ratings: {
    version: number;
    overall: {
      rating: number;
      deviation: number;
      volatility: number;
    };
  };
  ranking: number;
  professional: boolean;
  ui_class: string;
};
