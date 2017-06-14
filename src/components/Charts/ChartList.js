import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WinLoseChart from './WinLoseChart';

class ChartList extends Component {
  static propTypes = {
    gamesData : PropTypes.shape({
      playerId: PropTypes.number.isRequired,
      games   : PropTypes.array.isRequired
    }).isRequired
  }

  render() {
    return (
      <div>
        {
          this.props.gamesData.games.length > 0 ? (
            <WinLoseChart
              title={"Total games played on OGS"}
              id={"total_games_stats"}
              gamesData={this.props.gamesData}
            />
          ) : null
        }
      </div>
    );
  }
}

export default ChartList;
