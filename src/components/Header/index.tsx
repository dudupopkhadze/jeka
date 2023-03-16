import React from "react";
import "./style.css";
import { ReactComponent as PlaySVG } from "../../svgs/play.svg";
import { useCodeControllerContext } from "../../hooks";
import { useBoardControllerContext } from "../../hooks/useBoardControllerContext";
import axios from "axios";

export const Header: React.FC = () => {
  const { value } = useCodeControllerContext();
  const { boardController } = useBoardControllerContext();

  const handleRun = async () => {
    try {
      const res = await axios({
        method: "post",
        url: "http://localhost:8080/compile",
        data: { code: value.current.split("\n") },
      }).then((res: { data: { result: string[] } }) => res.data);

      console.log(res?.result);
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
