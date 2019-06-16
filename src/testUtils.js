import configureMockStore from "redux-mock-store";
import reduxThunk from "redux-thunk";
import MockApi from "./OGSApi/MockApi";

import {
  minDate,
  maxDate,
  rankedValues,
  tournamentValues,
  boardSizeValues,
  timeSettingsValues,
  colorValues,
  handicapValues
} from "./Redux/Charts/chartActions";

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
    ranked: rankedValues.values,
    tournament: tournamentValues.values,
    boardSize: boardSizeValues.values,
    timeSettings: timeSettingsValues.values,
    handicap: handicapValues.values,
    color: colorValues.values,
    limitEndDate: false,
    results: []
  }
};

export const testUser = {
  username: "anoek",
  rank: 10,
  id: 1,
  ratings: {
    "overall": {
      "rating": 2037.3212587307262,
      "deviation": 101.02544838717047,
      "volatility": 0.0603478949163655,
      "games_played": 55
    }
  }
}

export const testGame = {
  "related": {
    "detail": "/api/v1/games/3592811"
  },
  "players": {
    "black": {
      "id": 154799,
      "username": "C-J",
      "country": "un",
      "icon": "https://secure.gravatar.com/avatar/75afa880da5f1e563fbe61b77adb9e74?s=32&d=retro",
      "ratings": {
        "overall": {
          "rating": 2052.4600873547834,
          "deviation": 90.40601581299798,
          "volatility": 0.05835181259448531,
          "games_played": 755
        }
      },
      "ranking": 21,
      "professional": false,
      "ui_class": "timeout"
    },
    "white": {
      "id": 197819,
      "username": "Chinitsu",
      "country": "vn",
      "icon": "https://b0c2ddc39d13e1c0ddad-93a52a5bc9e7cc06050c1a999beb3694.ssl.cf1.rackcdn.com/3de44c88999a15ddae78c1a00c8b1d70-32.png",
      "ratings": {
        "overall": {
          "rating": 2037.3212587307262,
          "deviation": 101.02544838717047,
          "volatility": 0.0603478949163655,
          "games_played": 55
        }
      },
      "ranking": 25,
      "professional": false,
      "ui_class": ""
    }
  },
  "id": 3592811,
  "name": "Partie amicale",
  "creator": 154799,
  "mode": "game",
  "source": "play",
  "black": 154799,
  "white": 197819,
  "width": 19,
  "height": 19,
  "rules": "japanese",
  "ranked": true,
  "handicap": 0,
  "komi": "6.50",
  "time_control": "byoyomi",
  "black_player_rank": 24,
  "black_player_rating": "1501.077",
  "white_player_rank": 24,
  "white_player_rating": "1570.130",
  "time_per_move": 40,
  "time_control_parameters": "{\"time_control\": \"byoyomi\", \"period_time\": 30, \"main_time\": 900, \"periods\": 5}",
  "disable_analysis": false,
  "tournament": null,
  "tournament_round": 0,
  "ladder": null,
  "pause_on_weekends": false,
  "outcome": "23.5 points",
  "black_lost": true,
  "white_lost": false,
  "annulled": false,
  "started": "2015-12-30T09:44:24.535987-05:00",
  "ended": "2015-12-30T10:32:19.004810-05:00",
  "sgf_filename": null,
  "historical_ratings": {
    "black": {
      "id": 154799,
      "ratings": {
        "overall": {
          "rating": 1907.0003662109375,
          "deviation": 83.0797119140625,
          "volatility": 0.06039298325777054
        }
      },
      "username": "C-J",
      "country": "C-J",
      "ranking": 21,
      "professional": false,
      "icon": "https://secure.gravatar.com/avatar/75afa880da5f1e563fbe61b77adb9e74?s=32&d=retro",
      "ui_class": "timeout"
    },
    "white": {
      "id": 197819,
      "ratings": {
        "overall": {
          "rating": 2191.936279296875,
          "deviation": 115.35725402832031,
          "volatility": 0.06003699079155922
        }
      },
      "username": "Chinitsu",
      "country": "Chinitsu",
      "ranking": 25,
      "professional": false,
      "icon": "https://b0c2ddc39d13e1c0ddad-93a52a5bc9e7cc06050c1a999beb3694.ssl.cf1.rackcdn.com/3de44c88999a15ddae78c1a00c8b1d70-32.png",
      "ui_class": ""
    }
  }
}

export const createMockStore = (storeOverrides) => {
  const mockStore = configureMockStore([reduxThunk]);

  return mockStore({
    ...emptyStore,
    OGSApi: MockApi,
    ...storeOverrides
  });
}