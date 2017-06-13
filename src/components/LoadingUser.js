import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LoadingUser extends Component {
  static propTypes = {
    errorMessage: PropTypes.string,
    currentPage : PropTypes.number,
    totalPages   : PropTypes.number
  }

  render() {
    const {
      errorMessage,
      currentPage,
      totalPages
    } = this.props;

    const loadMessage = currentPage ? <p>Fetching games result from OGS: page {currentPage} of {totalPages}.</p> : null;

    return (
      <div className="loading_text">
        <svg className="loading_icon animating" width="150" height="150">
          <line className="hrline" x1="0" y1="71.5" x2="142" y2="71.5" stroke="#f8f8ff" strokeWidth="1" />
          <line className="vrline" x1="71.5" y1="0" x2="71.5" y2="142" stroke="#f8f8ff" strokeWidth="1" />
          <circle className="black_stone3" cx="71.5" cy="28.5" r="19.5" strokeWidth="0" fill="#000000" />
          <circle className="black_stone2" cx="28.5" cy="71.5" r="19.5" strokeWidth="0" fill="#000000" />
          <circle className="black_stone1" cx="114.5" cy="71.5" r="19.5" strokeWidth="0" fill="#000000" />
          <circle className="black_stone4" cx="71.5" cy="114.5" r="19.5" strokeWidth="0" fill="#000000" />
          <circle className="white_stone" cx="71.5" cy="71.5" r="20" strokeWidth="0" fill="#f8f8ff" />
        </svg>
        {loadMessage}
        <p className="error">{errorMessage}</p>
      </div>
    );
  }
}

export default LoadingUser;
