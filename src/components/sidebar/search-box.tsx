"use client";

import { ThunkDispatch } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, SubmitEventHandler, useState } from "react";
import { connect } from "react-redux";
import { GameState } from "@/redux/games/type";
import { fetchPlayer, importPlayer } from "@/redux/player/player-actions";
import { PlayerAction, PlayerState } from "@/redux/player/type";
import { StoreState } from "@/redux/type";
import { cn } from "@/utils/cn";

const exporterVersion = 0;

export type SearchBoxProps = {
  importPlayerData: (data: { player: PlayerState; games: GameState }) => void;
  getPlayerData: (user: string) => void;
};

function SearchBox({ importPlayerData, getPlayerData }: SearchBoxProps) {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const updateSearchUser: ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (event) => {
    setUsername(event.target.value);
  };

  const submit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (username.trim()) {
      router.push(`/user/${username}`);
      getPlayerData(username);

      setUsername("");
    }
  };

  // downloadJSON = () => {
  //   const { id, username, ratings, rank, registrationDate } = this.props.player;

  //   const { start, end, results } = this.props.games;

  //   const jsonString = JSON.stringify({
  //     exporterVersion,
  //     player: {
  //       id,
  //       username,
  //       ratings,
  //       rank,
  //       registrationDate,
  //     },
  //     games: {
  //       start,
  //       end,
  //       results,
  //     },
  //   });

  //   var blob = new Blob([jsonString], { type: "text/json;charset=utf-8" });
  //   saveAs(blob, `gotstats_${username}.json`);
  //   window.alert("Player data file exported.\nYou can use it for quick import in the future.");
  // };

  // readFile = (event) => {
  //   const file = event.target.files[0];
  //   var reader = new FileReader();
  //   reader.onload = (evt) => {
  //     this.readImportedJSON(evt.target.result);
  //   };
  //   reader.readAsText(file);
  // };

  // readImportedJSON = (jsonString) => {
  //   const data = JSON.parse(jsonString);
  //   this.props.history.push(`/user/${data.player.username}`);
  //   this.props.importPlayerData(data);
  // };

  return (
    <form onSubmit={submit}>
      <div className="flex">
        <input
          value={username}
          onChange={updateSearchUser}
          name="id"
          type="text"
          placeholder="Username or ID"
          className="rounded-l-sm border-1 px-2 py-1 bg-white error:border-red-500 border-primary accent-primary text-background-light"
        />
        <button
          type="submit"
          className={cn(
            "rounded-r-sm px-4 py-1 border-1 border-solid focus:outline-0 inline-flex items-center gap-2 font-bold bg-primary border-primary text-foreground cursor-pointer",
            "cursor-pointer duration-200 hover:shadow-sm hover:-translate-y-[1px] active:duration-0 active:translate-y-0 active:shadow-none",
          )}
        >
          Got Stats?
        </button>
      </div>

      {/* <p className="text-center">
        <small className="tip help-block">
          <em>-- or --</em>
        </small>
      </p>

      <div className="form-group">
        <p className="d-flex justify-content-between">
          <input type="file" onChange={this.readFile} id="file_input" style={{ display: "none" }} />
          <button type="button" className="btn btn-secondary" onClick={() => document.getElementById("file_input").click()}>
            Import Data
          </button>
          {this.props.games.results.length > 0 && (
            <button type="button" className="btn btn-secondary" onClick={this.downloadJSON}>
              Export Data
            </button>
          )}
        </p>
      </div> */}
    </form>
  );
}

const mapReduxStateToProps = ({ player, games }: StoreState) => ({ player, games });
const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, PlayerAction>) => ({
  importPlayerData: (data: { player: PlayerState; games: GameState }) => dispatch(importPlayer(data)),
  getPlayerData: (player: string) => dispatch(fetchPlayer(player)),
});

export default connect(mapReduxStateToProps, mapDispatchToProps)(SearchBox);
