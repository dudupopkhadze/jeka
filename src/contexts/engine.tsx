import React, { useCallback, useRef, useState } from "react";
import { Engine } from "../engine";
import { useBoard } from "../hooks";
import { JekaInstruction } from "../types";

type IEngineContext = {
  error: string | null;
  processDirectInstructions: (
    instructions: JekaInstruction[],
    reset?: boolean
  ) => void;
  processInput: (input: string) => void;
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
  const { board } = useBoard();
  const [engine] = useState(
    () =>
      new Engine({
        board,
        onError: setError,
      })
  );

  const setEngineProcessingDelay = useCallback(
    (delay: number) => {
      engine.setDelay(delay);
    },
    [engine]
  );

  const processDirectInstructions = useCallback(
    (instructions: JekaInstruction[], reset?: boolean) => {
      engine.processDirect(instructions, reset);
    },
    [engine]
  );

  const processInput = useCallback(
    (input: string) => {
      engine.process(input);
    },
    [engine]
  );

  const resetEngineState = useCallback(() => {
    engine.reset();
  }, [engine]);

  return (
    <EngineContext.Provider
      value={{
        error,
        processInput,
        processDirectInstructions,
        setEngineProcessingDelay,
        resetEngineState,
      }}
    >
      {children}
    </EngineContext.Provider>
  );
};
