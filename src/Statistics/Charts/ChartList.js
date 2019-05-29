import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Analyzer from '../../Data/Analyzer';

import WinLoseChart from './WinLoseChart';
import ResultDistributionChart from './ResultDistributionChart';
import BoardSizesChart from './BoardSizesChart';
import TimeSettingsChart from './TimeSettingsChart';
import OpponentChart from './OpponentChart';
import MiscChart from './MiscChart';


class ChartList extends Component {
  static propTypes = {
    chartsData: PropTypes.array.isRequired,
    player: PropTypes.object.isRequired
  }

  createGameData(games) {
    return {
      playerId: this.props.player.id,
      games: games
    }
  }

  render() {
    const gamesData = this.createGameData(this.props.chartsData);

    const lostGames = gamesData.games.reduce((loseCount, currentGame) => {
      if (!Analyzer.isPlayerWin(currentGame, this.props.player.id)) {
        return loseCount + 1;
      }
      else {
        return loseCount;
      }
    }, 0);

    const rankedGames = gamesData.games.filter(game => game.ranked);
    const unrankedGames = gamesData.games.filter(game => !game.ranked);
    const evenGames = gamesData.games.filter(game => game.handicap === 0);
    const tournamentGames = gamesData.games.filter(game => game.tournament !== null);
    const uniqueTournaments = tournamentGames.reduce((result, game) => {
      if (result.indexOf(game.tournament) === -1) {
        result.push(game.tournament);
      }

      return result;
    }, []);

    return (
      <div>
        {
          gamesData.games.length > 0 && (
            <WinLoseChart
              title={`Total games played on OGS: ${gamesData.games.length}`}
              id={"total_games_stats"}
              gamesData={gamesData}
              footer={
                lostGames >= 50 ? (
                  <div className="row">
                    <div className="col-12">
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
          gamesData.games.length > 0 && (
            <ResultDistributionChart
              title={`Game results distribution`}
              id={"game_results"}
              gamesData={gamesData}
              player={this.props.player}
            />
          )
        }
        {
          rankedGames.length > 0 && (
            <WinLoseChart
              title={`Ranked Games: ${rankedGames.length}`}
              id={"ranked_games_stats"}
              gamesData={this.createGameData(rankedGames)}
            />
          )
        }
        {
          unrankedGames.length > 0 && (
            <WinLoseChart
              title={`Unranked Games: ${unrankedGames.length}`}
              id={"unranked_games_stats"}
              gamesData={this.createGameData(unrankedGames)}
            />
          )
        }
        {
          evenGames.length > 0 && (
            <WinLoseChart
              title={`Even Games: ${evenGames.length}`}
              id={"even_games_stats"}
              gamesData={this.createGameData(evenGames)}
            />
          )
        }
        {
          tournamentGames.length > 0 && (
            <WinLoseChart
              title={`Participated in ${uniqueTournaments.length} tournaments`}
              id={"tournament_games_stats"}
              gamesData={this.createGameData(tournamentGames)}
            />
          )
        }
        {
          gamesData.games.length > 0 && (
            <BoardSizesChart
              title={`Performance across board sizes`}
              id={"board_sizes_stats"}
              gamesData={gamesData}
            />
          )
        }
        {
          gamesData.games.length > 0 && (
            <TimeSettingsChart
              title={`Performance across time settings`}
              id={"time_settings_stats"}
              gamesData={gamesData}
            />
          )
        }
        {
          gamesData.games.length > 0 && (
            <OpponentChart
              title={`Number of opponents faced`}
              id={"opponents_stats"}
              gamesData={gamesData}
              player={this.props.player}
            />
          )
        }
        {
          gamesData.games.length > 0 && (
            <MiscChart
              title={`Miscellaneous statistics`}
              id={"misc_stats"}
              allGames={this.props.games.results}
              gamesData={gamesData}
              player={this.props.player}
            />
          )
        }
      </div>
    );
  }
}
const mapReduxStateToProps = ({ chartsData, games, player }) => ({ chartsData, games, player });

export default connect(mapReduxStateToProps)(ChartList);
