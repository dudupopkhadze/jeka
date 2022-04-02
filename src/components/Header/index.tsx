import React from "react";
import "./style.css";
import { ReactComponent as PlaySVG } from "../../svgs/play.svg";
import { useCodeControllerContext } from "../../hooks";

export const Header: React.FC = () => {
  const { codeController } = useCodeControllerContext();
  return (
    <div className="Header">
      <button
        onClick={() => codeController.compile()}
        className="Header-Compile"
      >
        <PlaySVG className="Header-Compile-Icon" />
        Compile
      </button>
    </div>
  );
};
