function computeWinLoseStatistics(games, playerId){
	var blackGames = 0, whiteGames = 0,
			blackLosses = 0, whiteLosses = 0;

  games.forEach(game =>{
    if(game.players.black.id === playerId){
      blackGames++;
      if(game.black_lost){
        blackLosses++;
      }
    }
    else{
      whiteGames++;
      if(game.white_lost){
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

function computeWinLoseDistributions(games, playerId){
  var distributions = {
    "id"        : playerId,
    "Opp+Other" : 0,
    "Opp+Count" : 0,
    "Opp+Time" 	: 0,
    "Opp+Res" 	: 0,
    "Opp+40+"		: 0,
    "Opp+30+"		: 0,
    "Opp+20+"		: 0,
    "Opp+10+"		: 0,
    "Opp+0+"		: 0,
    "Plr+0+"		: 0,
    "Plr+10+"		: 0,
    "Plr+20+"		: 0,
    "Plr+30+"		: 0,
    "Plr+40+"		: 0,
    "Plr+Res"		: 0,
    "Plr+Time"	: 0,
    "Plr+Count" : 0,
    "Plr+Other" : 0
  };

  return games.reduce(assignGameResultToDistributions, distributions);
}

function assignGameResultToDistributions(distributions, game){
  const isWin = (game.players.black.id === distributions.id && game.white_lost) || (game.players.white.id === distributions.id && game.black_lost);

  if(game.outcome === "Resignation"){
    distributions[`${isWin ? 'Plr' : 'Opp'}+Res`]++;
  }
  else if(game.outcome === "Timeout"){
    distributions[`${isWin ? 'Plr' : 'Opp'}+Time`]++;
  }
  else if(!isNaN(game.outcome.split(" ")[0])){
    const points = parseInt(game.outcome.split(" ")[0], 10);

    const pointDiff = points % 10;
    var result = (pointDiff < 4 ? pointDiff : 4) + "0+";
    result = `${isWin ? 'Plr' : 'Opp'}+${result}`;

    distributions[`${isWin ? 'Plr' : 'Opp'}+Count`]++;
    distributions[result]++;
  }
  else{
    distributions[`${isWin ? 'Plr' : 'Opp'}+Other`]++;
  }

  return distributions;
}

export default {
  computeWinLoseStatistics,
  computeWinLoseDistributions
};
