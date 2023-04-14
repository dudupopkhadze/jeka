import React, { useCallback, useRef, useState } from "react";
import { Board } from "../board";
import { BoardConfigs, StartingBoardLabel } from "../config";
import { BoardConfig, BoardSizeLabel } from "../types";

export const BoardControllerContext = React.createContext<
  | {
      board: Board;
      boardSize: BoardSizeLabel;
      updateBoardConfig: (config: BoardConfig) => void;
    }
  | undefined
>(undefined);

const startingConfig = BoardConfigs.find(
  ({ label }) => label === StartingBoardLabel
)!;

export const BoardContextProvider = (props: {
  children: React.ReactElement;
  startingConfig?: BoardConfig;
  height?: number;
  width?: number;
}) => {
  const boardRef = useRef(
    new Board(
      {
        rows: (props.startingConfig ?? startingConfig).rows,
        columns: (props.startingConfig ?? startingConfig).columns,
        label: (props.startingConfig ?? startingConfig).label,
        boneLocations: props.startingConfig?.boneLocations,
        // obstacles: startingConfig.obstacles,
      },
      props.width,
      props.height
    )
  );
  const [boardSize, setBoardSize] =
    useState<BoardSizeLabel>(StartingBoardLabel);

  const updateBoardConfig = useCallback((config: BoardConfig) => {
    boardRef.current.setBoard(config);
    setBoardSize(config.label);
  }, []);

  return (
    <BoardControllerContext.Provider
      value={{
        board: boardRef.current,
        boardSize,
        updateBoardConfig,
      }}
    >
      {props.children}
    </BoardControllerContext.Provider>
  );
};
