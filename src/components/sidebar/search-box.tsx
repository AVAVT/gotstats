"use client";

import { ThunkDispatch } from "@reduxjs/toolkit";
import moment from "moment";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, Fragment, SubmitEventHandler, useState } from "react";
import { connect } from "react-redux";
import { Button, Input } from "vat-ui";
import { GameState } from "@/redux/games/type";
import { fetchPlayer, importPlayer } from "@/redux/player/player-actions";
import { PlayerAction, PlayerState } from "@/redux/player/type";
import { StoreState } from "@/redux/type";

export type SearchBoxProps = {
  player: PlayerState;
  games: GameState;
  fetchPlayerData: (player: string) => void;
  importPlayerData: (data: { player: PlayerState; games: GameState }) => void;
};

const deprecationDate = new Date("2026-06-01");

function SearchBox({ player, games, fetchPlayerData, importPlayerData }: SearchBoxProps) {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const updateSearchUser: ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (event) => {
    setUsername(event.target.value);
  };

  const submit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (username.trim()) {
      router.push(`/user/${username}`);
      fetchPlayerData(username);

      setUsername("");
    }
  };

  const readFile: ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = (evt) => {
      if (!evt.target?.result) return;
      readImportedJSON(evt.target.result as string);
    };
    reader.readAsText(file);
  };

  const readImportedJSON = (jsonString: string) => {
    const data = JSON.parse(jsonString);
    router.push(`/user/${data.player.username}`);
    importPlayerData(data);
  };

  return (
    <form onSubmit={submit}>
      <div className="flex">
        <Input
          color="primary"
          value={username}
          onChange={updateSearchUser}
          name="id"
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
      {new Date() < deprecationDate && (
        <Fragment>
          <p className="text-center">
            <small className="tip help-block">
              <em>-- or --</em>
            </small>
          </p>

          <div>
            <p className="d-flex justify-content-between">
              <input type="file" onChange={readFile} id="file_input" style={{ display: "none" }} />
              <Button
                color="tertiary"
                type="button"
                className="text-foreground"
                onClick={() => document.getElementById("file_input")?.click()}
              >
                Import Data
              </Button>
            </p>
          </div>

          <div className="text-sm opacity-70 mt-2 italic">
            <span className="font-bold">NOTICE</span>: JSON import feature will be deprecated on{" "}
            {moment(deprecationDate).format("MMM D, yyyy")}. You no longer have to manually save & load json file,
            player data will be automatically saved in your browser.
          </div>
        </Fragment>
      )}
    </form>
  );
}

const mapReduxStateToProps = ({ player, games }: StoreState) => ({ player, games });
const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, PlayerAction>) => ({
  importPlayerData: (data: { player: PlayerState; games: GameState }) => dispatch(importPlayer(data)),
  fetchPlayerData: (player: string) => dispatch(fetchPlayer(player)),
});

export default connect(mapReduxStateToProps, mapDispatchToProps)(SearchBox);
