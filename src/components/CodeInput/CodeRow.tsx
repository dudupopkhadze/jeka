import React, { useCallback } from "react";
import { useCodeControllerContext } from "../../controllers";
import "../../styles/CodeInput.css";

interface CodeRowProps {
  rowNumber: number;
  isActive: boolean;
  onPress: (rowNumber: number) => void;
}

const FunctionKeywords = ["function"];

const VariableKeywords = ["const", "let", "var"];

const OperationKeywords = ["=", ">", "<", "||"];

const getClassnameForToken = (token: string) => {
  if (FunctionKeywords.find((k) => k === token)) return "Code-fn";
  if (VariableKeywords.find((k) => k === token)) return "Code-vr";
  if (OperationKeywords.find((k) => k === token)) return "Code-op";
  return "Code";
};

const parseCodeRow = (value: string) => {
  const tokens = value.split(" ");
  return tokens.map((token, i) => {
    const classname = getClassnameForToken(token);
    return { classname, value: token + " " };
  });
};

const CodeRow: React.FC<CodeRowProps> = ({ rowNumber, isActive, onPress }) => {
  const { codeController } = useCodeControllerContext();

  const handlePress = useCallback(
    () => onPress(rowNumber),
    [onPress, rowNumber]
  );

  const chunks = parseCodeRow(codeController.getData(rowNumber));

  return (
    <div
      onClick={handlePress}
      className={
        isActive ? "CodeInput-Row-Container--Active" : "CodeInput-Row-Container"
      }
    >
      <div className="CodeInput-Row-Number">{rowNumber + 1}</div>
      <div className="CodeInput-Row-Span">
        {chunks.map(({ value, classname }, i) => (
          <span key={i} className={`CodeInput-Row-Span-${classname}`}>
            {value}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CodeRow;
