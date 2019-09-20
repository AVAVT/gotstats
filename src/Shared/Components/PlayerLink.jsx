import React from 'react';
import ExtLink from "./ExtLink";

import { getPlayerRankDisplay } from "../utils";
import { OGS_ROOT, OGS_API_ROOT } from "../../OGSApi/configs.json";

const PlayerLink = ({ player }) => {
  const href = `${OGS_ROOT}user/view/${player.id}/${player.username}`;
  const img = `${OGS_API_ROOT}${player.id}/icon?size=32`;
  const username = `${player.username} (${getPlayerRankDisplay(player)})`;

  return (<ExtLink href={href} title={username}><img className="img-20" src={img} alt={username} /> {username}</ExtLink>)
}

export default PlayerLink;