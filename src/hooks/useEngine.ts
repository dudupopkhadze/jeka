import { useContext } from "react";
import { EngineContext } from "../contexts";

export const useEngine = () => {
  const context = useContext(EngineContext);
  if (!context) throw new Error("EngineContext is not Under Provider");
  return context;
};
