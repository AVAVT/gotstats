import { differenceInCalendarDays, format as formatDate, getYear, startOfDay } from "date-fns";
import { PlayerState } from "@/redux/player/type";
import { Game } from "@/type/game";
import { Player } from "@/type/player";
import {
  extractHistoricalPlayerAndOpponent,
  getGameTimeSettings,
  getHighestRatingAchieved,
  getLongestWinStreak,
  getOpponent,
  getOpponentGameStats,
  isPlayerWin,
  type WinStreak,
} from "./chart-utils";

type ReviewMoment = {
  opponent: Player;
  game: Game;
};

type FirstVictoryMoment = ReviewMoment & {
  previousLosses: number;
};

export type YearInReview = {
  gamesPlayed: {
    total: number;
    diffFromLastYear: number;
    allYearsAverage: number;
  };
  ratings: {
    startRating: number;
    endRating: number;
    highestRating: number;
    highestRatingAchievedBy: Game | null;
    growthInYear: number;
  };
  winRate: {
    wins: number;
    losses: number;
    value: number;
    diffFromLastYear: number;
  };
  opponents: {
    total: number;
    newPlayerMet: number;
    byCountry: {
      country: string;
      opponents: number;
    }[];
    mostPlayedOpponents: {
      opponent: Player;
      games: number;
      isNewPlayerMet: boolean;
    }[];
  };
  gamesPlayedByMonth: {
    month: number;
    correspondence: number;
    live: number;
    blitz: number;
  }[];
  halfPointGames: {
    total: number;
    wins: number;
  };
  longestDailyStreak: {
    from: Game | null;
    to: Game | null;
    inbetweens: Game[];
    gamesPlayed: number;
    winRate: number;
  };
  tournament: {
    total: number;
    tournamentGames: number;
    ratio: number;
    winRate: number;
  };
  timeSettings: {
    realTime: number;
    correspondence: number;
    liveGameTime: number;
    averageCorrespondenceTime: number;
  };
  momentsToRemember: {
    upsettingWin: ReviewMoment | null;
    hardDefeat: ReviewMoment | null;
    firstVictory: FirstVictoryMoment | null;
    longestWinStreak: WinStreak | null;
    firstWinOfTheYear: ReviewMoment | null;
  };
};

const getHistoricalPlayerRating = (game: Game, playerId: number) => {
  const { historicalPlayer } = extractHistoricalPlayerAndOpponent(game, playerId);
  return historicalPlayer.ratings.overall.rating;
};

const getHistoricalOpponentRating = (game: Game, playerId: number) => {
  const { historicalOpponent } = extractHistoricalPlayerAndOpponent(game, playerId);
  return historicalOpponent.ratings.overall.rating;
};

const getEndedDate = (game: Game) => new Date(game.ended);

const getDayDate = (game: Game) => startOfDay(getEndedDate(game));

const getDayKey = (game: Game) => formatDate(getDayDate(game), "yyyy-M-d");

const getWinRate = (wins: number, total: number) => (total > 0 ? wins / total : 0);

const getYearCounts = (games: Game[]) => {
  const counts = new Map<number, number>();

  for (const game of games) {
    const gameYear = getYear(getEndedDate(game));
    counts.set(gameYear, (counts.get(gameYear) ?? 0) + 1);
  }

  return counts;
};

const getAllYearsAverage = (games: Game[]) => {
  const yearCounts = getYearCounts(games);

  if (yearCounts.size === 0) return 0;

  let totalGames = 0;
  for (const yearlyGames of yearCounts.values()) {
    totalGames += yearlyGames;
  }

  return totalGames / yearCounts.size;
};

const getOpponentsByCountry = (games: Game[], playerId: number) => {
  const uniqueOpponents = new Map<number, string>();

  for (const game of games) {
    const opponent = getOpponent(game, playerId);
    if (!uniqueOpponents.has(opponent.id)) {
      uniqueOpponents.set(opponent.id, opponent.country);
    }
  }

  const countryCounts = new Map<string, number>();

  for (const country of uniqueOpponents.values()) {
    countryCounts.set(country, (countryCounts.get(country) ?? 0) + 1);
  }

  return Array.from(countryCounts.entries())
    .map(([country, opponents]) => ({ country, opponents }))
    .sort((left, right) => right.opponents - left.opponents || left.country.localeCompare(right.country));
};

const getLongestDailyStreak = (games: Game[], playerId: number) => {
  const gamesByDay = new Map<string, Game[]>();

  for (const game of games) {
    const dayKey = getDayKey(game);
    const groupedGames = gamesByDay.get(dayKey);

    if (groupedGames) {
      groupedGames.push(game);
      continue;
    }

    gamesByDay.set(dayKey, [game]);
  }

  const orderedDays = Array.from(gamesByDay.entries())
    .map(([key, dayGames]) => ({
      key,
      date: getDayDate(dayGames[0]),
      games: [...dayGames].sort((left, right) => getEndedDate(left).getTime() - getEndedDate(right).getTime()),
    }))
    .sort((left, right) => left.date.getTime() - right.date.getTime());

  let bestStreak = {
    from: null as Game | null,
    to: null as Game | null,
    allGames: [] as Game[],
    gamesPlayed: 0,
    winRate: 0,
    days: 0,
  };
  let currentStreak = {
    from: null as Game | null,
    to: null as Game | null,
    allGames: [] as Game[],
    gamesPlayed: 0,
    wins: 0,
    days: 0,
  };
  let previousDate: Date | null = null;

  for (const day of orderedDays) {
    const shouldExtend = previousDate !== null && differenceInCalendarDays(day.date, previousDate) === 1;

    if (!shouldExtend) {
      currentStreak = {
        from: day.games[0] ?? null,
        to: day.games[day.games.length - 1] ?? null,
        allGames: [...day.games],
        gamesPlayed: day.games.length,
        wins: day.games.filter((game) => isPlayerWin(game, playerId)).length,
        days: 1,
      };
    } else {
      currentStreak = {
        from: currentStreak.from,
        to: day.games[day.games.length - 1] ?? currentStreak.to,
        allGames: [...currentStreak.allGames, ...day.games],
        gamesPlayed: currentStreak.gamesPlayed + day.games.length,
        wins: currentStreak.wins + day.games.filter((game) => isPlayerWin(game, playerId)).length,
        days: currentStreak.days + 1,
      };
    }

    if (
      currentStreak.days > bestStreak.days ||
      (currentStreak.days === bestStreak.days && currentStreak.gamesPlayed > bestStreak.gamesPlayed)
    ) {
      bestStreak = {
        from: currentStreak.from,
        to: currentStreak.to,
        allGames: currentStreak.allGames,
        gamesPlayed: currentStreak.gamesPlayed,
        winRate: getWinRate(currentStreak.wins, currentStreak.gamesPlayed),
        days: currentStreak.days,
      };
    }

    previousDate = day.date;
  }

  const middleGames = bestStreak.allGames.slice(1, bestStreak.allGames.length - 1);
  const inbetweens: Game[] = [];
  if (middleGames.length <= 2) {
    inbetweens.push(...middleGames);
  } else {
    const step = (middleGames.length - 1) / 2;
    inbetweens.push(middleGames[0], middleGames[Math.round(step)]);
  }

  return {
    from: bestStreak.from,
    to: bestStreak.to,
    inbetweens,
    gamesPlayed: bestStreak.gamesPlayed,
    winRate: bestStreak.winRate,
  };
};

const getReviewMoment = (game: Game | null, playerId: number): ReviewMoment | null => {
  if (!game) return null;

  return {
    game,
    opponent: getOpponent(game, playerId),
  };
};

const isPlayerLoss = (game: Game, playerId: number) => game.outcome !== "0.5 points" && !isPlayerWin(game, playerId);
const MIN_PREVIOUS_LOSSES_FOR_FIRST_VICTORY = 2;

const getFirstVictory = (games: Game[], playerId: number, year: number): FirstVictoryMoment | null => {
  const records = new Map<number, { hasWon: boolean; losses: number }>();
  const chronologicalGames = [...games].reverse();
  let bestCandidate: FirstVictoryMoment | null = null;

  for (const game of chronologicalGames) {
    const opponent = getOpponent(game, playerId);
    const record = records.get(opponent.id) ?? { hasWon: false, losses: 0 };
    const isWin = isPlayerWin(game, playerId);

    if (isWin && !record.hasWon) {
      record.hasWon = true;

      if (getEndedDate(game).getFullYear() === year && record.losses >= MIN_PREVIOUS_LOSSES_FOR_FIRST_VICTORY) {
        const candidate: FirstVictoryMoment = {
          game,
          opponent,
          previousLosses: record.losses,
        };

        if (!bestCandidate || candidate.previousLosses > bestCandidate.previousLosses) {
          bestCandidate = candidate;
        }
      }
    }

    if (isPlayerLoss(game, playerId)) {
      record.losses++;
    }

    records.set(opponent.id, record);
  }

  return bestCandidate;
};

const getRatingFromGame = (game: Game | null, player: PlayerState) => {
  if (!game) return player.ratings.overall.rating;
  return getHistoricalPlayerRating(game, player.id);
};

export function getYearInReview(player: PlayerState, games: Game[], year: number): YearInReview {
  // Filter games in the given year
  const gamesInYear = games.filter((g) => new Date(g.ended).getFullYear() === year);
  const totalGames = gamesInYear.length;

  // Games in the previous year
  const gamesInLastYear = games.filter((g) => new Date(g.ended).getFullYear() === year - 1);
  const diffGames = totalGames - gamesInLastYear.length;

  // First game after the year (fallback for when no games in year)
  const gamesAfterYear = games.filter((g) => new Date(g.ended).getFullYear() > year);
  const firstGameAfterYear = gamesAfterYear[gamesAfterYear.length - 1];

  // Ratings calculations
  let highestRating = 0;
  let highestRatingAchievedBy: Game | null = null;

  // If games in year exist, use them; otherwise use first game after year or current rating
  let startRating: number;
  let endRating: number;

  if (totalGames > 0) {
    // First game of the year (earliest, since games are sorted descending)
    const firstGameOfYear = gamesInYear[gamesInYear.length - 1];
    startRating = getRatingFromGame(firstGameOfYear, player);
    endRating = getRatingFromGame(firstGameAfterYear, player);

    const highestRatingInYear = getHighestRatingAchieved(gamesInYear, player.id);
    highestRating = highestRatingInYear.rating;
    highestRatingAchievedBy = highestRatingInYear.game;
  } else {
    // No games in year: use first game after year or current rating
    startRating = getRatingFromGame(firstGameAfterYear, player);
    endRating = getRatingFromGame(firstGameAfterYear, player);
    highestRating = getRatingFromGame(firstGameAfterYear, player);
  }

  const growthRating = endRating - startRating;

  // Win rate calculations
  let wins = 0;
  for (const game of gamesInYear) {
    if (isPlayerWin(game, player.id)) wins++;
  }
  const winRateValue = totalGames > 0 ? wins / totalGames : 0;
  const losses = totalGames - wins;

  let winsLastYear = 0;
  for (const game of gamesInLastYear) {
    if (isPlayerWin(game, player.id)) winsLastYear++;
  }
  const winRateLastYear = gamesInLastYear.length > 0 ? winsLastYear / gamesInLastYear.length : 0;
  const diffWinRate = winRateValue - winRateLastYear;

  const allYearsAverage = getAllYearsAverage(games);

  // Aggregate year-only metrics in one pass (time settings, tournaments, moments, and half-point results)
  let totalLiveTime = 0;
  let totalCorrespondenceTime = 0;
  let halfPointTotal = 0;
  let halfPointWins = 0;
  let realTimeGames = 0;
  let correspondenceGames = 0;
  let tournamentGames = 0;
  let tournamentWins = 0;
  const tournaments = new Set<number>();
  let upsettingWin: Game | null = null;
  let upsettingWinRating = -Infinity;
  let hardDefeat: Game | null = null;
  let hardDefeatRating = Infinity;
  let firstWinOfTheYear: Game | null = null;

  for (const game of gamesInYear) {
    const isWin = isPlayerWin(game, player.id);
    const timeSetting = getGameTimeSettings(game);

    if (game.outcome === "0.5 points") {
      halfPointTotal++;
      if (isWin) halfPointWins++;
    }

    if (timeSetting === "Blitz" || timeSetting === "Live") {
      const duration = new Date(game.ended).getTime() - new Date(game.started).getTime();
      totalLiveTime += duration;
      realTimeGames++;
    } else if (timeSetting === "Correspondence") {
      const duration = new Date(game.ended).getTime() - new Date(game.started).getTime();
      totalCorrespondenceTime += duration;
      correspondenceGames++;
    }

    if (game.tournament !== null) {
      tournamentGames++;
      tournaments.add(game.tournament);
      if (isWin) tournamentWins++;
    }

    if (game.ranked) {
      const opponentRating = getHistoricalOpponentRating(game, player.id);
      const playerRating = getHistoricalPlayerRating(game, player.id);

      if (isWin && opponentRating > playerRating && opponentRating > upsettingWinRating) {
        upsettingWin = game;
        upsettingWinRating = opponentRating;
      }

      if (!isWin && opponentRating < playerRating && opponentRating < hardDefeatRating) {
        hardDefeat = game;
        hardDefeatRating = opponentRating;
      }
    }

    if (isWin) {
      firstWinOfTheYear = game;
    }
  }

  // New players met
  const opponentsBeforeYear = new Set<number>();
  for (const game of games) {
    if (new Date(game.ended).getFullYear() >= year) continue;
    const opponentId = game.players.black.id === player.id ? game.players.white.id : game.players.black.id;
    opponentsBeforeYear.add(opponentId);
  }

  const opponentsInYear = new Set<number>();
  for (const game of gamesInYear) {
    const opponentId = game.players.black.id === player.id ? game.players.white.id : game.players.black.id;
    opponentsInYear.add(opponentId);
  }

  const newOpponentIds = new Set(Array.from(opponentsInYear).filter((id) => !opponentsBeforeYear.has(id)));
  const totalNew = newOpponentIds.size;
  const totalPlayed = opponentsInYear.size;

  // Games played by month
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    correspondence: 0,
    live: 0,
    blitz: 0,
  }));

  for (const game of gamesInYear) {
    const month = new Date(game.ended).getMonth() + 1; // 1-12
    const timeSetting = getGameTimeSettings(game);
    if (timeSetting === "Correspondence") months[month - 1].correspondence++;
    else if (timeSetting === "Live") months[month - 1].live++;
    else if (timeSetting === "Blitz") months[month - 1].blitz++;
  }

  const mostPlayedOpponents = getOpponentGameStats(gamesInYear, player.id)
    .slice(0, 5)
    .map((record) => ({
      opponent: record.opponent,
      games: record.games,
      isNewPlayerMet: newOpponentIds.has(record.opponent.id),
    }));
  const opponentsByCountry = getOpponentsByCountry(gamesInYear, player.id);
  const longestDailyStreak = getLongestDailyStreak(gamesInYear, player.id);
  const longestWinStreak = getLongestWinStreak(gamesInYear, player.id);
  const firstVictory = getFirstVictory(games, player.id, year);

  return {
    gamesPlayed: {
      total: totalGames,
      diffFromLastYear: diffGames,
      allYearsAverage,
    },
    ratings: {
      startRating,
      endRating,
      highestRating,
      highestRatingAchievedBy,
      growthInYear: growthRating,
    },
    winRate: {
      wins,
      losses,
      value: winRateValue,
      diffFromLastYear: diffWinRate,
    },
    opponents: {
      total: totalPlayed,
      newPlayerMet: totalNew,
      byCountry: opponentsByCountry,
      mostPlayedOpponents,
    },
    gamesPlayedByMonth: months,
    halfPointGames: {
      total: halfPointTotal,
      wins: halfPointWins,
    },
    longestDailyStreak,
    tournament: {
      total: tournaments.size,
      tournamentGames,
      ratio: getWinRate(tournamentGames, totalGames),
      winRate: getWinRate(tournamentWins, tournamentGames),
    },
    timeSettings: {
      realTime: realTimeGames,
      correspondence: correspondenceGames,
      liveGameTime: totalLiveTime,
      averageCorrespondenceTime: correspondenceGames > 0 ? totalCorrespondenceTime / correspondenceGames : 0,
    },
    momentsToRemember: {
      upsettingWin: getReviewMoment(upsettingWin, player.id),
      hardDefeat: getReviewMoment(hardDefeat, player.id),
      firstVictory,
      longestWinStreak,
      firstWinOfTheYear: getReviewMoment(firstWinOfTheYear, player.id),
    },
  };
}
