"use client";

import Image from "next/image";
import { connect } from "react-redux";
import { PlayerState } from "@/redux/player/type";
import { StoreState } from "@/redux/type";
import { getPlayerRankDisplay } from "@/utils/utils";

export interface HeaderProps {
  player: PlayerState;
}

function Header({ player }: HeaderProps) {
  const { username } = player;

  const pageTitle = username ? `statistics for player ${username} (${getPlayerRankDisplay(player)})` : "statistics";

  return (
    <nav className="header flex justify-start items-center p-4">
      <Image
        width={88.4}
        height={30}
        className="OGS_logo d-inline-block align-top mr-2"
        src="https://cdn.online-go.com/assets/ogs_dark.svg"
        alt="OGS logo"
      />
      <h1 className="page_title">{pageTitle}</h1>
    </nav>
  );
}

const mapReduxStateToProps = ({ player }: StoreState) => ({ player });

export default connect(mapReduxStateToProps)(Header);
