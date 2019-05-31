const minDate = new Date(-8640000000000000);
const maxDate = new Date(8640000000000000);

export const emptyStore = {
  player: {
    id: -1,
    username: "",
    rating: 0,
    rank: 0,
    fetching: null,
    fetchError: "",
    registrationDate: null
  },
  games: {
    results: [],
    fetching: null,
    fetchingPage: 0,
    fetchingTotalPage: 0,
    fetchError: "",
    start: minDate,
    end: maxDate
  },
  chartsData: {
    startDate: minDate,
    endDate: maxDate,
    ranked: 0,
    tournament: 0,
    boardSize: 0,
    timeSettings: 0,
    color: 0,
    handicap: 0,
    results: []
  }
};

export const testUser = {
  username: "anoek",
  rank: 10,
  id: 1
}

export const testGame = {
  "related": {
    "detail": "/api/v1/games/4"
  },
  "players": {
    "white": {
      "related": {
        "detail": "/api/v1/players/1"
      },
      "id": 1,
      "username": "anoek",
      "country": "us",
      "icon": "",
      "ranking": 10,
      "professional": false
    },
    "black": {
      "related": {
        "detail": "/api/v1/players/4"
      },
      "id": 4,
      "username": "matburt",
      "country": "us",
      "icon": "",
      "ranking": 11,
      "professional": false
    }
  },
  "id": 4,
  "name": "",
  "creator": 4,
  "mode": "game",
  "source": "play",
  "black": 4,
  "white": 1,
  "width": 19,
  "height": 19,
  "rules": "aga",
  "ranked": true,
  "handicap": 0,
  "komi": "0.50",
  "time_control": "simple",
  "time_per_move": 86400,
  "time_control_parameters": null,
  "disable_analysis": false,
  "tournament": null,
  "tournament_round": 0,
  "ladder": null,
  "pause_on_weekends": false,
  "outcome": "Timeout",
  "black_lost": false,
  "white_lost": true,
  "annulled": false,
  "started": "2012-11-15T17:25:57.920Z",
  "ended": "2012-11-25T06:22:59.261Z"
}