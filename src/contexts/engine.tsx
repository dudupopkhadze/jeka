import React, { useCallback, useRef } from "react";
import { BoardController } from "../controllers";
import { Engine } from "../engine";
import { useBoardController } from "../hooks";

export const EngineContext = React.createContext<
  { getEngine: () => Engine } | undefined
>(undefined);

export const EngineContextProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const { boardController } = useBoardController();
  const ref = useRef(new Engine(boardController));

  const getEngine = useCallback(() => ref.current, []);

  return (
    <EngineContext.Provider value={{ getEngine }}>
      {children}
    </EngineContext.Provider>
  );
};
