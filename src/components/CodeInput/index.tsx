import React, { useCallback, useRef, useState } from "react";
import "./CodeInput.css";
import { useCodeControllerContext } from "../../hooks";
import CodeRow from "./CodeRow";
import { measureText } from "../../utils";
import { KeyboardController } from "../../controllers";

interface CodeInputState {
  activeRow: number;
  value: string;
}

export const CodeInput = () => {
  const { codeController } = useCodeControllerContext();
  const ref = useRef<HTMLInputElement>(null);
  const [{ activeRow, value }, setState] = useState<CodeInputState>({
    activeRow: 0,
    value: codeController.getData(0),
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    ref.current?.focus();
    e.stopPropagation();

    let stateCandidate: CodeInputState | null =
      KeyboardController.handleKeyPress(e.key, activeRow, codeController);

    if (stateCandidate) setState(stateCandidate);
  };

  const switchToRow = useCallback(
    (rowNumber: number) => {
      setState({
        activeRow: rowNumber,
        value: codeController.getData(rowNumber),
      });
      ref.current?.focus();
    },
    [codeController]
  );

  const handleValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const v = codeController.contact(value, activeRow);
      setState((c) => {
        return {
          ...c,
          value: v,
        };
      });
      ref.current!.value = "";
    },
    [activeRow, codeController]
  );

  return (
    <div className="CodeInput-Container">
      {new Array(codeController.length()).fill(0).map((_, i) => {
        return (
          <CodeRow
            key={i}
            onPress={switchToRow}
            rowNumber={i}
            isActive={activeRow === i}
          />
        );
      })}
      <input
        ref={ref}
        tabIndex={1}
        className="CodeInput-Row-Input"
        style={{
          top: `${4 + 20 * activeRow}px`,
          left: `${25 + measureText(value).width}px`,
        }}
        value={""}
        onChange={handleValueChange}
        onKeyDown={handleKeyPress}
      />
      <div tabIndex={0} onFocus={() => ref.current?.focus()} />
    </div>
  );
};
