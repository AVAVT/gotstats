import React, { Component } from 'react';
import PropTypes from 'prop-types';

class QuickLinks extends Component {
  constructor(props){
    super(props);

    this.scrollHandler = this.scrollHandler.bind(this);
  }

  scrollHandler(event){
    event.preventDefault();
    this.props.scrollToElem(event.target.closest('a').getAttribute("href").replace("#", ""));
  }

  render() {
    return (
      <ul className="nav navi_list">
        <li><a href="#total_games_stats" onClick={this.scrollHandler}>Total games played on OGS</a></li>
        <li><a href="#game_results" onClick={this.scrollHandler}>Game results distribution</a></li>
        <li><a href="#ranked_games_stats" onClick={this.scrollHandler}>Ranked games</a></li>
        <li><a href="#unranked_games_stats" onClick={this.scrollHandler}>Unranked games</a></li>
        <li><a href="#even_games_stats" onClick={this.scrollHandler}>Even games</a></li>
        <li><a href="#tournament_games_stats" onClick={this.scrollHandler}>Performance in tournaments</a></li>
        <li><a href="#board_sizes_stats" onClick={this.scrollHandler}>Performance across board sizes</a></li>
        <li><a href="#time_settings_stats" onClick={this.scrollHandler}>Performance across time settings</a></li>
        <li><a href="#opponents_stats" onClick={this.scrollHandler}>Opponents statistics</a></li>
        <li><a href="#misc_stats" onClick={this.scrollHandler}>Miscellaneous statistics</a></li>
      </ul>
    );
  }
}

QuickLinks.propTypes = {
  scrollToElem : PropTypes.func.isRequired
}

export default QuickLinks;
