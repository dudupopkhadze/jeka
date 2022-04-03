import React from "react";
import { BoardController } from "../controllers";

const boardController = new BoardController();

export const BoardControllerContext = React.createContext<
  { boardController: BoardController } | undefined
>(undefined);

export const BoardControllerContextProvider: React.FC = ({ children }) => {
  return (
    <BoardControllerContext.Provider value={{ boardController }}>
      {children}
    </BoardControllerContext.Provider>
  );
};