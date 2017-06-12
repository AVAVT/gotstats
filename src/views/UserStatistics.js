import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

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

  componentDidMount() {
    this.fetchUserData(this.props.match.params.id);
  }

  fetchUserData(user){
    var requestPlayerById = function(id){
  		$.get(`${this.props.apiRoot}${id}`)
      .done(function(res){
        this.setState({
          player : res
        });

				this.props.updateUserInfo({
          username : res.username,
          rank     : this.convertRankToDisplay(res.ranking),
          id       : res.id,
          isRanked : (res.provisional_games_left < 1)
        });

				// getAllGames(onGameFetchingComplete);
			}.bind(this))
      .fail(function(err){
				alert(`Error connecting to OGS server. <strong>Error code: ${err.status}</strong>. Please try again later or contact me if you really have the need to stalk that person.`);
			});
  	}.bind(this);

    if(isNaN(user)){ // Entered username
			$.get(`${this.props.apiRoot}?username=${user}`)
      .done(function(res){
				if(res.results.length > 0){
					this.props.updateUserInfo(res.results[0]);
					requestPlayerById(res.results[0].id);
				}
				else{
					alert("Error: user not found. Are you sure you entered the correct username? If it still doesn't work, try using user id instead.");
				}
			}.bind(this))
      .fail(function(err){
				alert(`Error connecting to OGS server. <strong>Error code: ${err.status}</strong>. Please try again later or contact me if you really have the need to stalk that person.`);
			});
		}
		else{  // Entered user id
			requestPlayerById(user);
		}
  }

  convertRankToDisplay(rank){
		if(rank < 30)
			return (30 - rank) +  "k";
		else
			return (rank - 29) + "d";
	}


  render() {
    return (
      <div className="Welcome">
      	Data for user {this.props.match.params.id}
      </div>
    );
  }
}

export default UserStatistics;
