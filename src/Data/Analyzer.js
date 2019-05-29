import { getPlayerRank } from "./utils";

function computeWinLoseStatistics(games, playerId) {
  var blackGames = 0, whiteGames = 0,
    blackLosses = 0, whiteLosses = 0;

  games.forEach(game => {
    if (game.players.black.id === playerId) {
      blackGames++;
      if (game.black_lost) {
        blackLosses++;
      }
    }
    else {
      whiteGames++;
      if (game.white_lost) {
        whiteLosses++;
      }
    }
  });

  return {
    blackGames,
    blackLosses,
    whiteGames,
    whiteLosses
  }
}

function computeWinLoseDistributions(games, playerId) {
  var distributions = {
    "id": playerId,
    "Opp+Other": 0,
    "Opp+Count": 0,
    "Opp+Time": 0,
    "Opp+Res": 0,
    "Opp+40+": 0,
    "Opp+30+": 0,
    "Opp+20+": 0,
    "Opp+10+": 0,
    "Opp+0+": 0,
    "Plr+0+": 0,
    "Plr+10+": 0,
    "Plr+20+": 0,
    "Plr+30+": 0,
    "Plr+40+": 0,
    "Plr+Res": 0,
    "Plr+Time": 0,
    "Plr+Count": 0,
    "Plr+Other": 0
  };

  return games.reduce(assignGameResultToDistributions, distributions);
}

function computeBoardSizes(games, playerId) {
  var nineteenGames = 0, thirteenGames = 0, nineGames = 0, otherGames = 0,
    nineteenLosses = 0, thirteenLosses = 0, nineLosses = 0, otherLosses = 0;

  games.forEach(game => {
    if (game.width === 19 && game.height === 19) {
      nineteenGames++;
      if (!isPlayerWin(game, playerId)) nineteenLosses++;
    }
    else if (game.width === 13 && game.height === 13) {
      thirteenGames++;
      if (!isPlayerWin(game, playerId)) thirteenLosses++;
    }
    else if (game.width === 9 && game.height === 9) {
      nineGames++;
      if (!isPlayerWin(game, playerId)) nineLosses++;
    }
    else {
      otherGames++;
      if (!isPlayerWin(game, playerId)) otherLosses++;
    }
  });

  return {
    nineteenGames, thirteenGames, nineGames, otherGames,
    nineteenLosses, thirteenLosses, nineLosses, otherLosses
  }
}

function computeTimeSettings(games, playerId) {
  var blitzGames = 0, liveGames = 0, correspondenceGames = 0,
    blitzLosses = 0, liveLosses = 0, correspondenceLosses = 0;
  games.forEach(game => {
    if (game.time_per_move < 20) {
      blitzGames++;
      if (!isPlayerWin(game, playerId)) {
        blitzLosses++;
      }
    }
    else if (game.time_per_move > 10800) {
      correspondenceGames++;
      if (!isPlayerWin(game, playerId)) {
        correspondenceLosses++;
      }
    }
    else {
      liveGames++;
      if (!isPlayerWin(game, playerId)) {
        liveLosses++;
      }
    }
  });

  return {
    blitzGames, liveGames, correspondenceGames,
    blitzLosses, liveLosses, correspondenceLosses
  }
}

function computeOpponentsInfo(games, playerId) {
  var opponents = [], numberOfOpponents = 0;
  var weakestOpp = { rank: 70 };
  var strongestOpp = { rank: 0 };
  var mostPlayed = { games: 0 };
  var strongestDefeated = { rank: 0 };

  games.forEach(game => {
    const { opponent } = extractPlayerAndOpponent(game, playerId);
    const opponentRank = getPlayerRank(opponent);
    if (isPlayerWin(game, playerId) && opponentRank > strongestDefeated.rank) {
      strongestDefeated = {
        ...opponent,
        url: game.related.detail.split("games/")[1],
        date: game.ended,
        rank: opponentRank,
      };
    }

    if (!opponents[opponent.id]) {
      opponents[opponent.id] = 1;
    }
    else {
      opponents[opponent.id]++;
    }

    if (opponents[opponent.id] > mostPlayed.games) {
      mostPlayed = {
        ...opponent,
        games: opponents[opponent.id]
      };
    }

    if (opponentRank > strongestOpp.rank)
      strongestOpp = {
        ...opponent,
        rank: opponentRank
      };

    if (opponentRank < weakestOpp.rank)
      weakestOpp = {
        ...opponent,
        rank: opponentRank
      };
  });

  numberOfOpponents = 0;
  for (var k in opponents) {
    if (opponents.hasOwnProperty(k)) {
      numberOfOpponents++;
    }
  }

  return {
    strongestOpp,
    weakestOpp,
    mostPlayed,
    strongestDefeated,
    numberOfOpponents,
    averageGamePerOpponent: (games.length / numberOfOpponents).toFixed(2)
  }
}

function extractPlayerAndOpponent(game, playerId) {
  return game.players.black.id === playerId
    ? {
      player: game.players.black,
      opponent: game.players.white
    } : {
      player: game.players.white,
      opponent: game.players.black
    }
}

function isPlayerWin(game, playerId) {
  return ((game.players.black.id === playerId && game.white_lost)
    || (game.players.white.id === playerId && game.black_lost))
}

function assignGameResultToDistributions(distributions, game) {
  const isWin = (game.players.black.id === distributions.id && game.white_lost) || (game.players.white.id === distributions.id && game.black_lost);

  if (game.outcome === "Resignation") {
    distributions[`${isWin ? 'Plr' : 'Opp'}+Res`]++;
  }
  else if (game.outcome === "Timeout") {
    distributions[`${isWin ? 'Plr' : 'Opp'}+Time`]++;
  }
  else if (!isNaN(game.outcome.split(" ")[0])) {
    const points = parseFloat(game.outcome.split(" ")[0], 10);
    const pointDiff = Math.floor(points / 10);

    var result = (pointDiff < 4 ? pointDiff : 4) * 10 + "+";
    result = `${isWin ? 'Plr' : 'Opp'}+${result}`;

    distributions[`${isWin ? 'Plr' : 'Opp'}+Count`]++;
    distributions[result]++;
  }
  else {
    distributions[`${isWin ? 'Plr' : 'Opp'}+Other`]++;
  }

  return distributions;
}

function computeMiscInfo(allGames, analyzingGames, player) {
  let mostActiveDay;
  let currentDay = new Date();
  currentDay.setHours(0, 0, 0, 0);

  let longestStreak = { streak: 0 }
  let currentStreak = { streak: 0 }

  let gamesOnMostActiveDay = 0, gamesOnCurrentDay = 0;

  for (let game of analyzingGames) {

    // Longest streak
    if (isPlayerWin(game, player.id)) {

      currentStreak.streak++;
      currentStreak.start = game;

      if (!currentStreak.end) currentStreak.end = game;

      if (currentStreak.streak > longestStreak.streak) longestStreak = currentStreak;
    }
    else currentStreak = { streak: 0 }


    // Most active day
    let gameDay = new Date(game.ended);
    gameDay.setHours(0, 0, 0, 0);
    if (daysDifferenceBetween(currentDay, gameDay) !== 0) {
      currentDay = gameDay;
      gamesOnCurrentDay = 1;
    }
    else {
      gamesOnCurrentDay++;
    }

    if (gamesOnCurrentDay > gamesOnMostActiveDay) {
      mostActiveDay = currentDay;
      gamesOnMostActiveDay = gamesOnCurrentDay;
    }
  }

  let memberSince = new Date(player.registrationDate);
  // Change memberSince to date of first game for player who migrated from old server
  if (allGames.length) {
    let firstGameDate = new Date(allGames[allGames.length - 1].started);
    if (firstGameDate < memberSince) memberSince = firstGameDate;
  }

  let gamesPerDay = 0;
  if (analyzingGames.length) {
    let dateOfFirstGame = new Date(analyzingGames[analyzingGames.length - 1].started)
    let daysSinceStart = daysDifferenceBetween(new Date(), dateOfFirstGame);
    gamesPerDay = analyzingGames.length / parseFloat(daysSinceStart);
  }

  return {
    memberSince: memberSince,
    gamesPerDay: gamesPerDay,
    longestStreak: longestStreak,
    mostActiveDay: mostActiveDay,
    gamesOnMostActiveDay: gamesOnMostActiveDay
  }
}

function daysDifferenceBetween(day1, day2) {
  /* Copa pasta I don't even know if there's any bug here */

  // Copy date parts of the timestamps, discarding the time parts.
  var two = new Date(day1.getFullYear(), day1.getMonth(), day1.getDate());
  var one = new Date(day2.getFullYear(), day2.getMonth(), day2.getDate());

  // Do the math.
  var millisecondsPerDay = 1000 * 60 * 60 * 24;
  var millisBetween = two.getTime() - one.getTime();
  var days = millisBetween / millisecondsPerDay;

  // Round down.
  return two > one ? Math.floor(days) : Math.ceil(days);
}

export default {
  computeWinLoseStatistics,
  computeWinLoseDistributions,
  computeBoardSizes,
  computeTimeSettings,
  computeOpponentsInfo,
  computeMiscInfo,
  isPlayerWin,
};
