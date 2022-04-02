import { useContext } from "react";
import { CodeControllerContext } from "../contexts";

export const useCodeControllerContext = () => {
  const context = useContext(CodeControllerContext);
  if (!context) throw new Error("CodeControllerContext is not Under Provider");
  return context;
};
