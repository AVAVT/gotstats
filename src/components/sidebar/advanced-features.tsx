"use client";

import { ThunkDispatch } from "@reduxjs/toolkit";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useState } from "react";
import { connect } from "react-redux";
import { Button } from "vat-ui";
import { exporterVersion } from "@/redux/games/game-actions";
import { GameState } from "@/redux/games/type";
import { importPlayer } from "@/redux/player/player-actions";
import { PlayerAction, PlayerState } from "@/redux/player/type";
import { StoreState } from "@/redux/type";

export type AdvancedFeaturesProps = {
  player: PlayerState;
  games: GameState;
  importPlayerData: (data: { player: PlayerState; games: GameState }) => void;
};

function AdvancedFeatures({ player, games, importPlayerData }: AdvancedFeaturesProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

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

  const downloadJSON = () => {
    const { id, username, ratings, rank, registrationDate } = player;
    const { start, end, results } = games;

    const jsonString = JSON.stringify({
      exporterVersion,
      player: {
        id,
        username,
        ratings,
        rank,
        registrationDate,
      },
      games: {
        start,
        end,
        results,
      },
    });

    var blob = new Blob([jsonString], { type: "text/json;charset=utf-8" });
    saveAs(blob, `gotstats_${username}.json`);
    window.alert("Player data file exported.\nYou can use it for quick import to another machine.");
  };

  return (
    <div>
      <button
        type="button"
        className="bg-transparent outline-0 border-0 fake-link py-2 inline-block cursor-pointer text-sm"
        onClick={() => setExpanded(!expanded)}
      >
        Advanced Features {expanded ? "-" : "+"}
      </button>

      <div className={expanded ? "" : "hidden"}>
        <div>
          <p className="flex justify-stretch gap-4">
            <input type="file" onChange={readFile} id="file_input" style={{ display: "none" }} />
            <Button
              color="tertiary"
              type="button"
              className="text-foreground justify-center flex-1"
              onClick={() => document.getElementById("file_input")?.click()}
            >
              Import Data
            </Button>
            {games.results.length > 0 && (
              <Button color="tertiary" className="text-foreground justify-center flex-1" onClick={downloadJSON}>
                Export Data
              </Button>
            )}
          </p>
        </div>

        <div className="text-sm opacity-70 mt-2 italic">
          <span className="font-bold">NOTICE</span>: Auto save in-browser implemented. JSON import should only be used
          to export to another device
        </div>
      </div>
    </div>
  );
}

const mapReduxStateToProps = ({ player, games }: StoreState) => ({ player, games });
const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, PlayerAction>) => ({
  importPlayerData: (data: { player: PlayerState; games: GameState }) => dispatch(importPlayer(data)),
});

export default connect(mapReduxStateToProps, mapDispatchToProps)(AdvancedFeatures);
