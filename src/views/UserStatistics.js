import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Communicator from '../services/Communicator';
import LoadingUser from '../components/LoadingUser';

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
      loadingCompleted  : false,
      loadingPageNo     : 0
    }
  }

  componentDidMount() {
    this.fetchUserData(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.id !== nextProps.match.params.id){
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
      // TODO don't use alert
      alert(err);
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

    if(localData != null && Array.isArray(localData)){
      this.setState({
        usingLocalStorage : true
      });
    }

    const connectionInfo = {
      isError     : false,
      retryNumber : 0,
      errorMessage: ""
    }
    this.setState({
      allGames : null
    })

    this.fetchGamePage([], userId, localData, connectionInfo);
  }

  fetchGamePage(allGames, userId, localData, connectionInfo, url){
    Communicator.fetchGamePage(userId, url)
    .then(function(res){
      this.setState({
        loadingPageNo : this.state.loadingPageNo+1,
        totalPages    : Math.ceil(res.count/50)
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
        if(localData) this.saveUserData(userId, allGames);
        this.setState({
          allGames : allGames
        });
      }

    }.bind(this))
    .catch(function(err){
      console.log(err);
      connectionInfo.isError = true;
      connectionInfo.retryNumber += 1;

      if(connectionInfo.retryNumber < 5){
          connectionInfo.errorMessage = "Error connecting to OGS server. <strong>Error code: " + err.status + "</strong>. Retrying in "+(connectionInfo.retryNumber*connectionInfo.retryNumber)+" seconds...";
          setTimeout(function(){
            this.fetchGamePage(allGames, userId, localData, connectionInfo, url)
          }.bind(this), connectionInfo.retryNumber*connectionInfo.retryNumber*1000);
      }
      else{
        connectionInfo.errorMessage = "Error connecting to OGS server. <strong>Error code: " + err.status + "</strong>. Please try again later or contact me if you really have the need to stalk that person.";
      }

      alert(connectionInfo.errorMessage);
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
    const display = this.state.allGames ? null : <LoadingUser />;

    return (
      <div className="Welcome">
      {display}
      	{JSON.stringify(this.state.allGames)}
      </div>
    );
  }
}

export default UserStatistics;
