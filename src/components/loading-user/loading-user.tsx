import { connect } from "react-redux";
import { StoreState } from "@/redux/type";

import "./go_loading.css";

export interface LoadingUserProps {
  errorMessage: string;
  fetching: boolean;
}

function LoadingUser({ errorMessage, fetching }: LoadingUserProps) {
  const loadMessage = `Fetching user info from OGS...`;

  return (
    <div className="loading_wrapper">
      {fetching && (
        <svg className="loading_icon animating" width="150" height="150">
          <title>Loading User...</title>
          <circle className="black_stone3" cx="71.5" cy="28.5" r="19.5" strokeWidth="0" fill="#000000" />
          <circle className="black_stone2" cx="28.5" cy="71.5" r="19.5" strokeWidth="0" fill="#000000" />
          <circle className="black_stone1" cx="114.5" cy="71.5" r="19.5" strokeWidth="0" fill="#000000" />
          <circle className="black_stone4" cx="71.5" cy="114.5" r="19.5" strokeWidth="0" fill="#000000" />
          <circle className="white_stone" cx="71.5" cy="71.5" r="20" strokeWidth="0" fill="#f8f8ff" />
        </svg>
      )}
      <p className="loading_text">{errorMessage || loadMessage}</p>
    </div>
  );
}

const mapReduxStateToProps = ({ player, games }: StoreState) => ({
  errorMessage: player.fetchError || games.fetchError,
  fetching: !!player.fetching || !!games.fetching,
});

export default connect(mapReduxStateToProps)(LoadingUser);
