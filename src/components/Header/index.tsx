import React from "react";
import "./style.css";
import { ReactComponent as PlaySVG } from "../../svgs/play.svg";
import { useCodeController } from "../../hooks";
import { useBoardController } from "../../hooks/useBoardController";
import axios from "axios";
import { JekaInstruction } from "../../types";
import { useEngine } from "../../hooks/useEngine";
import { Mustang } from "../../core";

export const Header: React.FC = () => {
  const { value } = useCodeController();
  const { processInstructions, error, resetEngineState } = useEngine();
  const { boardController } = useBoardController();

  const handleRun = async () => {
    try {
      const mustang = new Mustang();
      mustang.run(value.current);

      // const res = await axios({
      //   method: "post",
      //   url: "http://localhost:8080/compile",
      //   data: { code: value.current.split("\n") },
      // }).then(
      //   (res: { data: { result: JekaInstruction[] } }) => res.data.result
      // );

      const res = [
        JekaInstruction.MOVE_FORWARD,
        JekaInstruction.MOVE_FORWARD,
        JekaInstruction.TURN_LEFT,
        JekaInstruction.MOVE_FORWARD,
        // JekaInstruction.MOVE_FORWARD,
      ];

      // processInstructions(res);

      // console.log(res?.result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="Header">
      <div className="Header-Title-Wrapper ">
        <span className="Header-Title">Jeka</span>
        {error && <span className="Header-Error">{error}</span>}
      </div>
      <div className="Header-Controls">
        <button onClick={handleRun} className="Header-Compile">
          <PlaySVG className="Header-Compile-Icon" />
          Run
        </button>
        <button
          onClick={() => {
            processInstructions([JekaInstruction.MOVE_FORWARD], false);
          }}
          className="Header-Compile"
        >
          <PlaySVG className="Header-Compile-Icon" />
          Move
        </button>
        <button
          onClick={() => {
            processInstructions([JekaInstruction.TURN_LEFT], false);
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
