import React from "react";
import "./style.css";
import { ReactComponent as PlaySVG } from "../../svgs/play.svg";
import { ReactComponent as DOG } from "../../svgs/dog.svg";
import { useCodeController } from "../../hooks";
import { JekaInstruction } from "../../types";
import { useEngine } from "../../hooks/useEngine";

export const Header: React.FC = () => {
  const { value } = useCodeController();
  const { processDirectInstructions, processInput, error, resetEngineState } =
    useEngine();

  const handleRun = async () => {
    try {
      processInput(value.current);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="Header">
      <div className="Header-Title-Wrapper ">
        <span className="Header-Title">{`Jeka 🐶`}</span>

        {error && <span className="Header-Error">{error}</span>}
      </div>
      <div className="Header-Controls">
        <button onClick={handleRun} className="Header-Compile">
          <PlaySVG className="Header-Compile-Icon" />
          Run
        </button>
        <button
          onClick={() => {
            processDirectInstructions([JekaInstruction.MOVE_FORWARD], false);
          }}
          className="Header-Compile"
        >
          <PlaySVG className="Header-Compile-Icon" />
          Move
        </button>
        <button
          onClick={() => {
            processDirectInstructions([JekaInstruction.TURN_LEFT], false);
          }}
          className="Header-Compile"
        >
          <PlaySVG className="Header-Compile-Icon" />
          Turn
        </button>
        <button onClick={resetEngineState} className="Header-Compile">
          <PlaySVG className="Header-Compile-Icon" />
          Clear
        </button>
      </div>
    </div>
  );
};
