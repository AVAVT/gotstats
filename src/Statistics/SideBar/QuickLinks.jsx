import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scrollspy from 'react-scrollspy';

const links = [
  ["total_games_stats", "Total games played on OGS"],
  ["game_results", "Game results distribution"],
  ["ranked_games_stats", "Ranked games"],
  ["unranked_games_stats", "Unranked games"],
  ["even_games_stats", "Even games"],
  ["tournament_games_stats", "Performance in tournaments"],
  ["board_sizes_stats", "Performance across board sizes"],
  ["time_settings_stats", "Performance across time settings"],
  ["opponents_stats", "Opponents statistics"],
  ["misc_stats", "Miscellaneous statistics"]
]


class QuickLinks extends Component {
  static propTypes = {
    scrollToElem: PropTypes.func.isRequired
  }

  onLinkClicked = (event, link) => {
    event.preventDefault();
    this.props.scrollToElem(link);
  }

  renderLink = (linkData, index) => (<li key={index}><a href={`#${linkData[0]}`} onClick={(e) => this.onLinkClicked(e, linkData[0])}>{linkData[1]}</a></li>)

  render() {
    return (
      <Scrollspy className="navi_list" items={links.map(linkData => linkData[0])} currentClassName="active">
        {links.map(this.renderLink)}
      </Scrollspy>
    );
  }
}

export default QuickLinks;
