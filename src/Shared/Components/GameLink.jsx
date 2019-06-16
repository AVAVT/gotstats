import React from 'react';
import moment from "moment";

import { OGS_ROOT } from "../../OGSApi/configs.json";

import ExtLink from "./ExtLink";

const GameLink = ({ game }) => (<ExtLink href={`${OGS_ROOT}game/${game.related.detail.split("games/")[1]}`}>{moment(game.ended).format("MMM D, YYYY")}</ExtLink>)

export default GameLink;