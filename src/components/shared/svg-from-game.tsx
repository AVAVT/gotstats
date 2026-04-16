"use client";

import axios from "axios";
import { Fragment, useEffect, useMemo, useState } from "react";
import { OGS_API_ROOT } from "@/api/api-constants";
import { getGameSgf, saveGameSgf } from "@/persistence";
import { Game } from "@/type/game";

const DEFAULT_SIZE = 300;

type StoneColor = "B" | "W";

function parseFinalBoardFromSgf(sgf: string, width: number, height: number): Map<string, StoneColor> {
  const board = new Map<string, StoneColor>();

  const neighbors = (x: number, y: number): [number, number][] => {
    const result: [number, number][] = [];
    if (x > 0) result.push([x - 1, y]);
    if (x < width - 1) result.push([x + 1, y]);
    if (y > 0) result.push([x, y - 1]);
    if (y < height - 1) result.push([x, y + 1]);
    return result;
  };

  // Returns all stones in the group and whether the group has at least one liberty.
  const getGroup = (startX: number, startY: number): { stones: string[]; hasLiberty: boolean } => {
    const color = board.get(`${startX},${startY}`);
    if (!color) return { stones: [], hasLiberty: false };

    const visited = new Set<string>();
    const queue: [number, number][] = [[startX, startY]];
    let hasLiberty = false;

    while (queue.length > 0) {
      // biome-ignore lint/style/noNonNullAssertion: wth biome learn to read
      const [x, y] = queue.shift()!;
      const key = `${x},${y}`;
      if (visited.has(key)) continue;
      visited.add(key);

      for (const [nx, ny] of neighbors(x, y)) {
        const nColor = board.get(`${nx},${ny}`);
        if (nColor === undefined) {
          hasLiberty = true;
        } else if (nColor === color) {
          queue.push([nx, ny]);
        }
      }
    }

    return { stones: Array.from(visited), hasLiberty };
  };

  const removeCaptures = (x: number, y: number, opponentColor: StoneColor) => {
    for (const [nx, ny] of neighbors(x, y)) {
      if (board.get(`${nx},${ny}`) === opponentColor) {
        const { stones, hasLiberty } = getGroup(nx, ny);
        if (!hasLiberty) {
          for (const stone of stones) board.delete(stone);
        }
      }
    }
  };

  // Lookbehind prevents matching B/W inside property names like PB/PW/TB/TW.
  // Captures all consecutive bracket groups to handle multi-point notation (e.g. AB[dd][dp][pd]).
  const propertyPattern = /(?<![A-Za-z])(AB|AW|AE|B|W)((?:\[[^\]]*\])+)/g;
  const pointPattern = /\[([^\]]*)\]/g;

  const applyPoint = (property: string, point: string) => {
    // Empty point means pass for B/W; ignore.
    if (!point || point.length < 2) return;

    const x = point.charCodeAt(0) - 97;
    const y = point.charCodeAt(1) - 97;

    if (x < 0 || y < 0 || x >= width || y >= height) return;

    const key = `${x},${y}`;

    if (property === "AE") {
      board.delete(key);
      return;
    }

    if (property === "AB" || property === "B") {
      board.set(key, "B");
      // Setup stones (AB) don't trigger captures; regular moves (B) do.
      if (property === "B") removeCaptures(x, y, "W");
      return;
    }

    if (property === "AW" || property === "W") {
      board.set(key, "W");
      if (property === "W") removeCaptures(x, y, "B");
    }
  };

  let match = propertyPattern.exec(sgf);
  while (match) {
    const property = match[1];
    const bracketsStr = match[2];
    pointPattern.lastIndex = 0;
    let pointMatch = pointPattern.exec(bracketsStr);
    while (pointMatch) {
      applyPoint(property, pointMatch[1]);
      pointMatch = pointPattern.exec(bracketsStr);
    }
    match = propertyPattern.exec(sgf);
  }

  return board;
}

const requestMap = new Map<number, Promise<string>>();

// Mimick OGS
function getStarPoints(width: number, height: number): [number, number][] {
  if (width === 19 && height === 19) {
    return [
      [3, 3],
      [3, 9],
      [3, 15],
      [9, 3],
      [9, 9],
      [9, 15],
      [15, 3],
      [15, 9],
      [15, 15],
    ];
  }
  if (width === 13 && height === 13) {
    return [
      [3, 3],
      [3, 9],
      [6, 6],
      [9, 3],
      [9, 9],
    ];
  }
  if (width === 9 && height === 9) {
    return [
      [2, 2],
      [2, 6],
      [4, 4],
      [6, 2],
      [6, 6],
    ];
  }
  return [];
}

export default function SvgFromGame({
  game,
  boardLines,
  blackStone,
  whiteStone,
  background,
  hideBoardLines = false,
  className = "",
  size = DEFAULT_SIZE,
}: {
  game: Game;
  boardLines?: string;
  blackStone: string;
  whiteStone: string;
  background: string;
  hideBoardLines?: boolean;
  className?: string;
  size?: number;
}) {
  const [boardState, setBoardState] = useState<Map<string, StoneColor> | null>(null);

  const boardLinesColor = boardLines ?? blackStone;

  useEffect(() => {
    let cancelled = false;

    setBoardState(null);

    const fetchSgf = async () => {
      try {
        const storedSgf = await getGameSgf(game.id);
        if (storedSgf) {
          if (!cancelled) {
            setBoardState(parseFinalBoardFromSgf(storedSgf, game.width, game.height));
          }
          return;
        }

        let request = requestMap.get(game.id);
        if (!request) {
          request = (async () => {
            try {
              const response = await axios.get<string>(`${OGS_API_ROOT}/games/${game.id}/sgf`);
              return response.data;
            } finally {
              requestMap.delete(game.id);
            }
          })();
          requestMap.set(game.id, request);
        }

        const sgf = await request;

        try {
          void saveGameSgf(game.id, sgf);
        } catch (err) {
          console.error(err);
        }

        if (cancelled) {
          return;
        }

        setBoardState(parseFinalBoardFromSgf(sgf, game.width, game.height));
      } catch (err) {
        console.error(err);
      }
    };

    void fetchSgf();

    return () => {
      cancelled = true;
    };
  }, [game.id, game.width, game.height]);

  const padding = useMemo(() => size * 0.05, [size]);
  const boardWidth = useMemo(() => Math.max(game.width - 1, 1), [game.width]);
  const boardHeight = useMemo(() => Math.max(game.height - 1, 1), [game.height]);
  const gridWidth = useMemo(() => size - padding * 2, [size, padding]);
  const gridHeight = useMemo(() => size - padding * 2, [size, padding]);
  const cellX = useMemo(() => (game.width <= 1 ? 0 : gridWidth / boardWidth), [game.width, gridWidth, boardWidth]);
  const cellY = useMemo(
    () => (game.height <= 1 ? 0 : gridHeight / boardHeight),
    [game.height, gridHeight, boardHeight],
  );
  const stoneRadius = useMemo(() => Math.max(2, Math.min(cellX, cellY) * 0.42), [cellX, cellY]);

  if (boardState === null) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Loading game board">
        <rect x={0} y={0} width={size} height={size} fill={background} />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Final board state for game ${game.id}`}
      className={className}
    >
      <rect x={0} y={0} width={size} height={size} fill={background} />
      {!hideBoardLines && (
        <Fragment>
          {Array.from({ length: game.width }).map((_, x) => {
            const px = padding + x * cellX;
            return (
              <line
                key={`v-${x}`}
                x1={px}
                y1={padding}
                x2={px}
                y2={size - padding}
                stroke={boardLinesColor}
                strokeWidth={1}
                shapeRendering="geometricPrecision"
              />
            );
          })}

          {Array.from({ length: game.height }).map((_, y) => {
            const py = padding + y * cellY;
            return (
              <line
                key={`h-${y}`}
                x1={padding}
                y1={py}
                x2={size - padding}
                y2={py}
                stroke={boardLinesColor}
                strokeWidth={1}
                shapeRendering="geometricPrecision"
              />
            );
          })}

          {getStarPoints(game.width, game.height).map(([x, y]) => (
            <circle
              key={`star-${x}-${y}`}
              cx={padding + x * cellX}
              cy={padding + y * cellY}
              r={Math.max(3, Math.min(cellX, cellY) * 0.1)}
              fill={boardLinesColor}
              shapeRendering="geometricPrecision"
            />
          ))}
        </Fragment>
      )}

      {Array.from(boardState.entries()).map(([key, color]) => {
        const [xString, yString] = key.split(",");
        const x = Number(xString);
        const y = Number(yString);

        const cx = padding + x * cellX;
        const cy = padding + y * cellY;

        if (color === "W") {
          return (
            <circle
              key={key}
              cx={cx}
              cy={cy}
              r={stoneRadius}
              fill={whiteStone}
              stroke="none"
              shapeRendering="geometricPrecision"
            />
          );
        }

        return (
          <circle
            key={key}
            cx={cx}
            cy={cy}
            r={stoneRadius}
            fill={blackStone}
            stroke={whiteStone}
            strokeWidth={1}
            shapeRendering="geometricPrecision"
          />
        );
      })}
    </svg>
  );
}
