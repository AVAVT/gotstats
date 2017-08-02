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

function computeBoardSizes(games, playerId){
	var nineteenGames = 0, thirteenGames = 0, nineGames = 0, otherGames = 0,
			nineteenLosses = 0, thirteenLosses = 0, nineLosses = 0, otherLosses = 0;

  games.forEach(game =>{
		if(game.width === 19 && game.height === 19){
			nineteenGames++;
			if(!isPlayerWin(game, playerId)) nineteenLosses++;
		}
		else if(game.width === 13 && game.height === 13){
			thirteenGames++;
			if(!isPlayerWin(game, playerId)) thirteenLosses++;
		}
		else if(game.width === 9 && game.height === 9){
			nineGames++;
			if(!isPlayerWin(game, playerId)) nineLosses++;
		}
		else{
			otherGames++;
			if(!isPlayerWin(game, playerId)) otherLosses++;
		}
  });

  return {
		nineteenGames, thirteenGames, nineGames, otherGames,
		nineteenLosses, thirteenLosses, nineLosses, otherLosses
  }
}

function computeTimeSettings(games, playerId){
	var blitzGames = 0, liveGames = 0, correspondenceGames = 0,
			blitzLosses = 0, liveLosses = 0, correspondenceLosses = 0;
	games.forEach(game =>{
		if(game.time_per_move < 20){
			blitzGames++;
			if(!isPlayerWin(game, playerId)){
				blitzLosses++;
			}
		}
		else if(game.time_per_move > 10800){
			correspondenceGames++;
			if(!isPlayerWin(game, playerId)){
				correspondenceLosses++;
			}
		}
		else{
			liveGames++;
			if(!isPlayerWin(game, playerId)){
				liveLosses++;
			}
		}
	});

	return {
		blitzGames, liveGames, correspondenceGames,
		blitzLosses, liveLosses, correspondenceLosses
	}
}

function computeOpponentsInfo(games, playerId){
	var opponents = [], numberOfOpponents = 0;
	var weakestOpp = {rank: 70};
	var strongestOpp = {rank : 0};
	var mostPlayed = {games : 0};
	var strongestDefeated = {rank : 0};

	games.forEach(game => {
		let opponent = game.players.black.id === playerId ? game.players.white : game.players.black;

		if(isPlayerWin(game, playerId) && opponent.ranking > strongestDefeated.rank){
			strongestDefeated = {
				id			: opponent.id,
				username: opponent.username,
				rank 		: opponent.ranking,
				url 		: game.related.detail.split("games/")[1],
				outcome : (game.outcome === "Resignation" ? "a bloody" : "an intense")
			};
		}

		if(!opponents[opponent.id]){
			opponents[opponent.id] = 1;
		}
		else{
			opponents[opponent.id]++;
		}

		if(opponents[opponent.id] > mostPlayed.games){
			mostPlayed = {
				id			: opponent.id,
				username: opponent.username,
				rank 		: opponent.ranking,
				games 	: opponents[opponent.id]
			};
		}

		if(opponent.ranking > strongestOpp.rank){
			strongestOpp = {
				id			: opponent.id,
				username: opponent.username,
				rank 		: opponent.ranking
			};
		}

		if(opponent.ranking < weakestOpp.rank){
			weakestOpp = {
				id			: opponent.id,
				username: opponent.username,
				rank 		: opponent.ranking
			};
		}
	});

	numberOfOpponents = 0;
	for (var k in opponents) {
		if (opponents.hasOwnProperty(k)) {
			 numberOfOpponents++;
		}
	}

	strongestDefeated.rank = strongestDefeated.rank;

	return {
		strongestOpp,
		weakestOpp,
		mostPlayed,
		strongestDefeated,
		numberOfOpponents,
		averageGamePerOpponent : (games.length / numberOfOpponents).toFixed(2)
	}
}

function isPlayerWin(game, playerId){
	if( (game.players.black.id === playerId && game.black_lost)
			|| (game.players.white.id === playerId && game.white_lost)){
		return false;
	}
	else{
		return true;
	}
}

function rankNumberToKyuDan(rank){
	if(rank < 30)
		return (30 - rank) +  "k";
	else
		return (rank - 29) + "d";
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
    const points = parseFloat(game.outcome.split(" ")[0], 10);
    const pointDiff = Math.floor(points / 10);

    var result = (pointDiff < 4 ? pointDiff : 4)*10 + "+";
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
  computeWinLoseDistributions,
	computeBoardSizes,
	computeTimeSettings,
	computeOpponentsInfo,
	isPlayerWin,
	rankNumberToKyuDan
};
