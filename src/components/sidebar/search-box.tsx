"use client";

import { ThunkDispatch } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, SubmitEventHandler, useState } from "react";
import { connect } from "react-redux";
import { Button, Input } from "vat-ui";
import { GameState } from "@/redux/games/type";
import { fetchPlayer } from "@/redux/player/player-actions";
import { PlayerAction, PlayerState } from "@/redux/player/type";
import { StoreState } from "@/redux/type";
import { getAppRootUrl } from "../year-in-review/utils";

export type SearchBoxProps = {
  player: PlayerState;
  games: GameState;
  fetchPlayerData: (player: string) => void;
};

function SearchBox({ player, games, fetchPlayerData }: SearchBoxProps) {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const updateSearchUser: ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (event) => {
    setUsername(event.target.value);
  };

  const submit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (username.trim()) {
      router.push(`/user?user=${encodeURIComponent(username.trim())}`);
      fetchPlayerData(username.trim());

      setUsername("");
    }
  };

  return (
    <form action={`${getAppRootUrl()}/user`} onSubmit={submit}>
      <div className="flex">
        <Input
          color="primary"
          value={username}
          onChange={updateSearchUser}
          name="user"
          type="text"
          placeholder="Username or ID"
          className="rounded-r-none border-r-0"
        />
        <Button
          disabled={!!player.fetching || !!games.fetching}
          type="submit"
          color="primary"
          variant="solid"
          className="rounded-l-none flex-none text-foreground"
        >
          Got Stats?
        </Button>
      </div>
    </form>
  );
}

const mapReduxStateToProps = ({ player, games }: StoreState) => ({ player, games });
const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, PlayerAction>) => ({
  fetchPlayerData: (player: string) => dispatch(fetchPlayer(player)),
});

export default connect(mapReduxStateToProps, mapDispatchToProps)(SearchBox);
