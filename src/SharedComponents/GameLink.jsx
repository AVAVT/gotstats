import React from 'react';
import moment from "moment";

import { OGS_ROOT } from "../OGSApi/configs.json";

const GameLink = ({ game }) => (
  <a href={`${OGS_ROOT}game/${game.related.detail.split("games/")[1]}`} target="_blank" rel="noopener noreferrer nofollow">
    {moment(game.ended).format("MMM D, YYYY")}
  </a>
)

export default GameLink;