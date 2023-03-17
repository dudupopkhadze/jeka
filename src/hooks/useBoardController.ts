import { useContext } from "react";
import { BoardControllerContext } from "../contexts";

export const useBoardController = () => {
  const context = useContext(BoardControllerContext);
  if (!context) throw new Error("BoardControllerContext is not Under Provider");
  return context;
};
