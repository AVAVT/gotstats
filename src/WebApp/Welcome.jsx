import React from "react";

const Welcome = () => (
  <div>
    <h2>Welcome!</h2>
    <p className="instruction">
      Start by entering username into the search field to the right
      (case-sensitive).
    </p>
    <p>
      You can also use userID: my profile page is{" "}
      <em>https://online-go.com/user/view/999999</em>, meaning my user ID is
      999999.
    </p>
    <hr />
    <p>
      If you play a lot of games, be sure to Export after querying finished.
    </p>
    <p>
      It will save your games data into 1 file, which you can import later to
      save time.
    </p>
  </div>
);

export default Welcome;
