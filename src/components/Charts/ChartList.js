import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WinLoseChart from './WinLoseChart';
import ResultDistributionChart from './ResultDistributionChart';
import BoardSizesChart from './BoardSizesChart';
import TimeSettingsChart from './TimeSettingsChart';
import OpponentChart from './OpponentChart';

import Analyzer from '../../services/Analyzer';

class ChartList extends Component {
  static propTypes = {
    gamesData : PropTypes.shape({
      playerId: PropTypes.number.isRequired,
      games   : PropTypes.array.isRequired
    }).isRequired,
    player : PropTypes.object.isRequired
  }

  createGameDate(games){
    return {
      playerId  : this.props.gamesData.playerId,
      games     : games
    }
  }

  render() {
    const lostGames = this.props.gamesData.games.reduce((result, game) => {
      if(!Analyzer.isPlayerWin(game, this.props.gamesData.playerId)){
        return result + 1;
      }
      else{
        return result;
      }
    }, 0);

    const rankedGames = this.props.gamesData.games.filter(game => game.ranked);
    const unrankedGames = this.props.gamesData.games.filter(game => !game.ranked);
    const evenGames = this.props.gamesData.games.filter(game => game.handicap === 0);
    const tournamentGames = this.props.gamesData.games.filter(game => game.tournament !== null);
    const uniqueTournaments = tournamentGames.reduce((result, game) => {
      if(result.indexOf(game.tournament) === -1){
        result.push(game.tournament);
      }

      return result;
    }, []);

    return (
      <div>
        {
          this.props.gamesData.games.length > 0 && (
            <WinLoseChart
              title={`Total games played on OGS: ${this.props.gamesData.games.length}`}
              id={"total_games_stats"}
              gamesData={this.props.gamesData}
              footer={
                lostGames >= 50 ? (
                  <div className="row">
          					<div className="col-xs-12">
          						<p className="gratz">
                        Congratulations, <a target="_blank" rel="noopener noreferrer" href="http://senseis.xmp.net/?page=LoseYourFirst50GamesAsQuicklyAsPossible">you have lost your first 50 games</a>!
                      </p>
          					</div>
          				</div>
                ) : null
              }
            />
          )
        }
        {
          this.props.gamesData.games.length > 0 && (
            <ResultDistributionChart
              title={`Game results distribution`}
              id={"game_results"}
              gamesData={this.props.gamesData}
            />
          )
        }
        {
          rankedGames.length > 0 && (
            <WinLoseChart
              title={`Ranked Games: ${rankedGames.length}`}
              id={"ranked_games_stats"}
              gamesData={this.createGameDate(rankedGames)}
            />
          )
        }
        {
          unrankedGames.length > 0 && (
            <WinLoseChart
              title={`Unranked Games: ${unrankedGames.length}`}
              id={"unranked_games_stats"}
              gamesData={this.createGameDate(unrankedGames)}
            />
          )
        }
        {
          evenGames.length > 0 && (
            <WinLoseChart
              title={`Even Games: ${evenGames.length}`}
              id={"even_games_stats"}
              gamesData={this.createGameDate(evenGames)}
            />
          )
        }
        {
          tournamentGames.length > 0 && (
            <WinLoseChart
              title={`Participated in ${uniqueTournaments.length} tournaments`}
              id={"tournament_games_stats"}
              gamesData={this.createGameDate(tournamentGames)}
            />
          )
        }
        {
          this.props.gamesData.games.length > 0 && (
            <BoardSizesChart
              title={`Performance across board sizes`}
              id={"board_sizes_stats"}
              gamesData={this.props.gamesData}
            />
          )
        }
        {
          this.props.gamesData.games.length > 0 && (
            <TimeSettingsChart
              title={`Performance across time settings`}
              id={"time_settings_stats"}
              gamesData={this.props.gamesData}
            />
          )
        }
        {
          this.props.gamesData.games.length > 0 && (
            <OpponentChart
              title={`Number of opponents faced`}
              id={"opponents_stats"}
              gamesData={this.props.gamesData}
              player={this.props.player}
            />
          )
        }
      </div>
    );
  }
}

export default ChartList;
