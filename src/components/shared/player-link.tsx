import Image from "next/image";
import { OGS_API_ROOT, OGS_ROOT } from "@/ogs-api/api-constants";
import { Player } from "@/type/player";
import { getPlayerRankDisplay } from "@/utils/utils";
import ExtLink from "./external-link";

export interface PlayerLinkProps {
  player: Player;
}

export default function PlayerLink({ player }: PlayerLinkProps) {
  const href = `${OGS_ROOT}user/view/${player.id}/${player.username}`;
  const img = `${OGS_API_ROOT}${player.id}/icon?size=32`;
  const username = `${player.username} (${getPlayerRankDisplay(player)})`;

  return (
    <ExtLink href={href} title={username}>
      <Image className="img-20" src={img} alt={username} /> {username}
    </ExtLink>
  );
}
