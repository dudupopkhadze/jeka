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

export const BoardContextProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const boardRef = useRef(
    new Board({
      rows: startingConfig.rows,
      columns: startingConfig.columns,
      label: startingConfig.label,
      // boneLocations: startingConfig.boneLocations,
      // obstacles: startingConfig.obstacles,
    })
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
      {children}
    </BoardControllerContext.Provider>
  );
};
