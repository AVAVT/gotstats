import React from 'react';

import { getPlayerRankDisplay } from "../Data/utils";
import { OGS_ROOT, OGS_API_ROOT } from "../OGSApi/configs.json";

const PlayerLink = ({ player }) => {
  const href = `${OGS_ROOT}user/view/${player.id}/${player.username}`;
  const img = `${OGS_API_ROOT}${player.id}/icon?size=32`;
  const username = `${player.username} (${getPlayerRankDisplay(player)})`;

  return (
    <a target="_blank" rel="noopener noreferrer nofollow" href={href}>
      <img className="img-20" src={img} alt={username} /> {username}
    </a>
  )
}

export default PlayerLink;