import React, { useCallback, useRef, useState } from "react";
import { BoardController } from "../controllers";
import { Engine } from "../engine";
import { useBoardController } from "../hooks";

export const EngineContext = React.createContext<
  { getEngine: () => Engine; error: string | null } | undefined
>(undefined);

export const EngineContextProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [error, setError] = useState<string | null>(null);
  const { boardController } = useBoardController();
  const ref = useRef(new Engine(boardController, setError));

  const getEngine = useCallback(() => ref.current, []);

  return (
    <EngineContext.Provider value={{ getEngine, error }}>
      {children}
    </EngineContext.Provider>
  );
};
