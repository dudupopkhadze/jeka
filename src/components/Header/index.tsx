import React from "react";
import "./style.css";
import { ReactComponent as PlaySVG } from "../../svgs/play.svg";
import { useCodeController } from "../../hooks";
import { useBoardController } from "../../hooks/useBoardController";
import axios from "axios";
import { JekaInstruction } from "../../types";
import { useEngine } from "../../hooks/useEngine";

export const Header: React.FC = () => {
  const { value } = useCodeController();
  const { getEngine } = useEngine();
  const { boardController } = useBoardController();

  const handleRun = async () => {
    try {
      const res = await axios({
        method: "post",
        url: "http://localhost:8080/compile",
        data: { code: value.current.split("\n") },
      }).then(
        (res: { data: { result: JekaInstruction[] } }) => res.data.result
      );

      console.log("asdas");

      const engine = getEngine();
      engine.process(res);

      // console.log(res?.result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="Header">
      <button onClick={handleRun} className="Header-Compile">
        <PlaySVG className="Header-Compile-Icon" />
        Run
      </button>
      <button
        onClick={() => {
          boardController.drawTest2();
        }}
        className="Header-Compile"
      >
        <PlaySVG className="Header-Compile-Icon" />
        Turn
      </button>
      <button
        onClick={() => {
          boardController.clearBoard();
        }}
        className="Header-Compile"
      >
        <PlaySVG className="Header-Compile-Icon" />
        Clear
      </button>
    </div>
  );
};
