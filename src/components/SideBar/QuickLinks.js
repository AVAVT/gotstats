import React, { Component } from 'react';
import PropTypes from 'prop-types';

class QuickLinks extends Component {
  render() {
    return (
      <ul className="nav navi_list">
        <li><a href="#total_games_stats" onclick={this.props.scrollHandler('total_games_stats')}>Total games played on OGS</a></li>
        <li><a href="#game_results" onclick={this.props.scrollHandler('game_results')}>Game results distribution</a></li>
        <li><a href="#ranked_games_stats" onclick={this.props.scrollHandler('ranked_games_stats')}>Ranked games</a></li>
        <li><a href="#unranked_games_stats" onclick={this.props.scrollHandler('unranked_games_stats')}>Unranked games</a></li>
        <li><a href="#even_games_stats" onclick={this.props.scrollHandler('even_games_stats')}>Even games</a></li>
        <li><a href="#tournament_games_stats" onclick={this.props.scrollHandler('tournament_games_stats')}>Performance in tournaments</a></li>
        <li><a href="#board_sizes_stats" onclick={this.props.scrollHandler('board_sizes_stats')}>Performance across board sizes</a></li>
        <li><a href="#time_settings_stats" onclick={this.props.scrollHandler('time_settings_stats')}>Performance across time settings</a></li>
        <li><a href="#opponents_stats" onclick={this.props.scrollHandler('opponents_stats')}>Opponents statistics</a></li>
        <li><a href="#misc_stats" onclick={this.props.scrollHandler('misc_stats')}>Miscellaneous statistics</a></li>
      </ul>
    );
  }
}

QuickLinks.propTypes = {
  scrollHandler : PropTypes.func.isRequired
}

export default QuickLinks;
