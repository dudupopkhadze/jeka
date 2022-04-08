import React from "react";
import "./style.css";
import { ReactComponent as PlaySVG } from "../../svgs/play.svg";
import { useCodeControllerContext } from "../../hooks";
import { useBoardControllerContext } from "../../hooks/useBoardControllerContext";

export const Header: React.FC = () => {
  const { codeController } = useCodeControllerContext();
  const { boardController } = useBoardControllerContext();

  return (
    <div className="Header">
      <button
        onClick={() => {
          codeController.compile();
          boardController.drawTest();
        }}
        className="Header-Compile"
      >
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
