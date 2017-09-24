import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Communicator from '../services/Communicator';

import LoadingUser from '../components/LoadingUser';
import ChartList from '../components/Charts/ChartList';

class UserStatistics extends Component {
  static propTypes = {
    match         : PropTypes.shape({
      params : PropTypes.shape({
        id : PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]).isRequired,
      })
    }),
    updateUserInfo: PropTypes.func.isRequired,
    userData      : PropTypes.object,
    apiRoot       : PropTypes.string.isRequired
  }

  constructor(props){
    super(props);

    this.state = {
      player            : null,
      usingLocalStorage : false,
      loadingPageNo     : 0
    }
  }

  componentDidMount() {
    this.fetchUserData(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.id !== nextProps.match.params.id){
      this.setState({
        allGames      : null,
        loadingPageNo : 0,
        errorMessage  : ""
      });

      this.fetchUserData(nextProps.match.params.id);
    }
  }

  fetchUserData(user){
    Communicator.fetchUserId(user)
    .then(Communicator.fetchUserDataById)
    .then(res => {
      this.setState({
        player : res
      });

      this.props.updateUserInfo({
        username : res.username,
        rank     : this.convertRankToDisplay(res.ranking),
        id       : res.id,
        isRanked : (res.provisional_games_left < 1)
      });
      this.fetchUserGames(res.id);
    })
    .catch(err => {
      this.setState({
        errorMessage: err
      });
    });
  }

  fetchUserGames(userId){
    var localData = null;
    try{
      localData = JSON.parse(localStorage.getItem('ogsUserData_'+userId));
    }
    catch(e){
      localData = null;
    }

    if(localData && Array.isArray(localData)){
      this.setState({
        usingLocalStorage : true
      });
    }
    
    this.setState({
      allGames : null
    });

    const connectionInfo = {
      isError     : false,
      retryNumber : 0,
    }

    this.fetchGamePage([], userId, localData, connectionInfo);
  }

  fetchGamePage(allGames, userId, localData, connectionInfo, url){

    // If the search user has changed
    if(userId !== this.state.player.id) return;

    Communicator.fetchGamePage(userId, url)
    .then(function(res){
      this.setState({
        loadingPageNo : this.state.loadingPageNo+1,
        totalPages    : Math.ceil(res.count/50),
        errorMessage  : null
      });

      connectionInfo.isError = false;
      connectionInfo.retryNumber = 0;

      var completedWithLocalStorage = false;

      if(this.state.usingLocalStorage){
        res.results.some((item) =>{
          if(item.id === localData[0].id){
            allGames = allGames.concat(localData);
            completedWithLocalStorage = true;
            return true;
          }
          else{
            allGames.push(item);
          }

          return false;
        });
      }
      else{
        allGames = allGames.concat(res.results);
      }

      if(!completedWithLocalStorage && res.next != null){
        const next = res.next.replace("http://", "https://")
        this.fetchGamePage(allGames, userId, localData, connectionInfo, next);
      }
      else{
        // Finishes querying
        if(userId !== this.state.player.id) return; // Discard if not current player (user switched player search at last page)

        if(this.state.usingLocalStorage) this.saveUserData(userId, allGames);
        this.setState({
          allGames : allGames
        });
      }

    }.bind(this))
    .catch(function(err){
      connectionInfo.isError = true;
      connectionInfo.retryNumber += 1;
      var errorMessage = null;
      if(connectionInfo.retryNumber < 5){
          errorMessage = (
            <p className="error">
              Error connecting to OGS server. <strong>Error code: {err.status}</strong>. Retrying in {connectionInfo.retryNumber*connectionInfo.retryNumber} seconds...
            </p>
          );
          setTimeout(function(){
            this.fetchGamePage(allGames, userId, localData, connectionInfo, url)
          }.bind(this), connectionInfo.retryNumber*connectionInfo.retryNumber*1000);
      }
      else{
        errorMessage = (
          <p className="error">
            Error connecting to OGS server. <strong>Error code: {err.status }</strong>. Please try again later or contact me if you really have the need to stalk that person.
          </p>
        );
      }

      this.setState({
        errorMessage : errorMessage
      });
    }.bind(this))
  }

  saveUserData(userId, games){
		localStorage.clear();
		localStorage.setItem(`ogsUserData_${userId}`, JSON.stringify(games));
	}

  convertRankToDisplay(rank){
		if(rank < 30)
			return (30 - rank) +  "k";
		else
			return (rank - 29) + "d";
	}

  render() {
    return (
      <div>
      {
        this.state.allGames && this.state.player ?
        (<ChartList gamesData={{ games: this.state.allGames, playerId: this.state.player.id}} player={this.state.player}/>)
        : (<LoadingUser currentPage={this.state.loadingPageNo} totalPages={this.state.totalPages} errorMessage={this.state.errorMessage}/>)
      }
      </div>
    );
  }
}

export default UserStatistics;
