import React, { useCallback, useRef, useState } from "react";
import { Board } from "../board";
import { BoardConfigs, StartingBoardLabel } from "../config";
import { BoardSizeLabel } from "../types";

export const BoardControllerContext = React.createContext<
  | {
      board: Board;
      boardSize: BoardSizeLabel;
      updateBoardConfig: (label: BoardSizeLabel) => void;
    }
  | undefined
>(undefined);

export const BoardContextProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const boardRef = useRef(
    new Board(BoardConfigs.find(({ label }) => label === StartingBoardLabel)!)
  );
  const [boardSize, setBoardSize] =
    useState<BoardSizeLabel>(StartingBoardLabel);

  const updateBoardConfig = useCallback((label: BoardSizeLabel) => {
    boardRef.current.setBoard(BoardConfigs.find((v) => v.label === label)!);
    setBoardSize(label);
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
