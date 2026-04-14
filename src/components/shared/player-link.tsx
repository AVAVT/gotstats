import Image from "next/image";
import { OGS_API_PLAYER_ROOT, OGS_ROOT } from "@/api/api-constants";
import { Player } from "@/type/player";
import { getPlayerRankDisplay } from "@/utils/chart-utils";
import ExtLink from "./external-link";

export interface PlayerLinkProps {
  player: Player;
  iconSize?: number;
  className?: string;
}

export default function PlayerLink({ player, iconSize = 20, className = "" }: PlayerLinkProps) {
  const href = `${OGS_ROOT}user/view/${player.id}/${player.username}`;
  const img = `${OGS_API_PLAYER_ROOT}${player.id}/icon?size=${Math.round(iconSize / 32) * 32}`;
  const username = `${player.username} (${getPlayerRankDisplay(player)})`;

  return (
    <ExtLink href={href} title={username} className={className}>
      <Image
        width={iconSize}
        height={iconSize}
        src={img}
        alt={`${username}'s avatar`}
        className="inline-block rounded-sm"
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
        }}
      />{" "}
      {username}
    </ExtLink>
  );
}
