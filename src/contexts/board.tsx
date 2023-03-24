import React, { useCallback, useRef, useState } from "react";
import { BoardConfigs, StartingBoardLabel } from "../config";
import { BoardController } from "../controllers";
import { BoardSizeLabel } from "../types";

export const BoardControllerContext = React.createContext<
  | {
      boardController: BoardController;
      boardSize: BoardSizeLabel;
      updateBoardConfig: (label: BoardSizeLabel) => void;
    }
  | undefined
>(undefined);

export const BoardControllerContextProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const boardControllerRef = useRef(
    new BoardController(
      BoardConfigs.find(({ label }) => label === StartingBoardLabel)!
    )
  );
  const [boardSize, setBoardSize] =
    useState<BoardSizeLabel>(StartingBoardLabel);

  const updateBoardConfig = useCallback((label: BoardSizeLabel) => {
    setBoardSize(label);
  }, []);

  return (
    <BoardControllerContext.Provider
      value={{
        boardController: boardControllerRef.current,
        boardSize,
        updateBoardConfig,
      }}
    >
      {children}
    </BoardControllerContext.Provider>
  );
};
