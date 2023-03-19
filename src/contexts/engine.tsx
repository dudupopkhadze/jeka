import React, { useCallback, useRef, useState } from "react";
import { BoardController } from "../controllers";
import { Engine } from "../engine";
import { useBoardController } from "../hooks";
import { JekaInstruction } from "../types";

type IEngineContext = {
  error: string | null;
  processInstructions: (
    instructions: JekaInstruction[],
    reset?: boolean
  ) => void;
  setEngineProcessingDelay: (delay: number) => void;
  resetEngineState: () => void;
};

export const EngineContext = React.createContext<IEngineContext | undefined>(
  undefined
);

export const EngineContextProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [error, setError] = useState<string | null>(null);
  const { boardController } = useBoardController();
  const ref = useRef(new Engine(boardController, setError));

  const setEngineProcessingDelay = useCallback((delay: number) => {
    ref.current.setDelay(delay);
  }, []);

  const processInstructions = useCallback(
    (instructions: JekaInstruction[], reset?: boolean) => {
      ref.current.process(instructions, reset);
    },
    []
  );

  const resetEngineState = useCallback(() => {
    ref.current.reset();
  }, []);

  return (
    <EngineContext.Provider
      value={{
        error,
        processInstructions,
        setEngineProcessingDelay,
        resetEngineState,
      }}
    >
      {children}
    </EngineContext.Provider>
  );
};
