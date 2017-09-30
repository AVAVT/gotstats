import React, { Component } from 'react';

class Welcome extends Component {

  render() {
    return (
      <div className="Welcome">
      	<h1>Welcome!</h1>
      	<p className="instruction">Start by entering username or ID into the search field on the right (case-sensitive).</p>
        <p>You can also use user ID: my profile page is <em>https://online-go.com/use2r/view/197819/Chinitsu</em>, meaning my user ID is 197819.</p>
      </div>
    );
  }
}

export default Welcome;
