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
      player : null
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
    Communicator.fetchUserData(user)
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
      // getAllGames(onGameFetchingComplete);

    })
    .catch(err => {
      alert(err);
    });
  }

  convertRankToDisplay(rank){
		if(rank < 30)
			return (30 - rank) +  "k";
		else
			return (rank - 29) + "d";
	}


  render() {
    const display = this.state.player ? null : <LoadingUser />;

    return (
      <div className="Welcome">
      	{display}
      </div>
    );
  }
}

export default UserStatistics;
