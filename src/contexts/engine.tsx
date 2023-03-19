import React, { useCallback, useRef, useState } from "react";
import { Engine } from "../engine";
import { useBoardController } from "../hooks";
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
  const { boardController } = useBoardController();
  const ref = useRef(new Engine(boardController, setError));

  const setEngineProcessingDelay = useCallback((delay: number) => {
    ref.current.setDelay(delay);
  }, []);

  const processDirectInstructions = useCallback(
    (instructions: JekaInstruction[], reset?: boolean) => {
      ref.current.processDirect(instructions, reset);
    },
    []
  );

  const processInput = useCallback((input: string) => {
    ref.current.process(input);
  }, []);

  const resetEngineState = useCallback(() => {
    ref.current.reset();
  }, []);

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
