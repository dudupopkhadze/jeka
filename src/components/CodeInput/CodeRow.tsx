import React from "react";
import { useCodeControllerContext } from "../../controllers";
import "../../styles/CodeInput.css";

interface CodeRowProps {
  rowNumber: number;
  isActive: boolean;
}

const CodeRow: React.FC<CodeRowProps> = ({ rowNumber, isActive }) => {
  const { codeController } = useCodeControllerContext();
  return (
    <div
      className={
        isActive ? "CodeInput-Row-Container--Active" : "CodeInput-Row-Container"
      }
    >
      <div className="CodeInput-Row-Number">{rowNumber + 1}</div>
      <div className="CodeInput-Row-Span">
        {codeController.getData(rowNumber)}
      </div>
    </div>
  );
};

export default CodeRow;
