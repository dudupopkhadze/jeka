import React, { useCallback, useEffect, useRef, useState } from "react";
import "../../styles/CodeInput.css";
import { useCodeControllerContext } from "../../controllers";
import CodeRow from "./CodeRow";
import { measureText } from "../../utils";

export const CodeInput = () => {
  const { codeController } = useCodeControllerContext();
  const ref = useRef<HTMLInputElement>(null);
  const [{ activeRow, value }, setState] = useState({
    activeRow: 0,
    value: codeController.getData(0),
  });

  const [textSize, setTextSize] = useState(() => measureText(value).width);

  useEffect(() => {
    setTextSize(measureText(value).width);
  }, [value]);

  const moveCurrentRow = useCallback(
    (direction: "up" | "down" | "back") => {
      if (direction === "back" && codeController.getData(activeRow).length) {
        return;
      }

      const nextValue = direction === "down" ? activeRow + 1 : activeRow - 1;

      if (nextValue < 0) return;
      if (nextValue >= codeController.length()) {
        codeController.grow();
      }

      setState({
        activeRow: nextValue,
        value: codeController.getData(nextValue),
      });
      ref.current?.focus();
    },
    [activeRow, codeController]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Down": // IE/Edge specific value
        case "ArrowDown":
          moveCurrentRow("down");
          break;
        case "Up": // IE/Edge specific value
        case "ArrowUp":
          moveCurrentRow("up");
          break;

        case "Left": // IE/Edge specific value
        case "ArrowLeft": {
          if (ref.current?.selectionStart === 0) {
            moveCurrentRow("up");
          }

          break;
        }
        case "Right": // IE/Edge specific value
        case "ArrowRight":
          // Do something for "right arrow" key press.
          break;
        case "Enter":
          moveCurrentRow("down");
          break;
        case "Backspace": {
          moveCurrentRow("back");
          break;
        }

        case "Esc": // IE/Edge specific value
        case "Escape":
          break;
        default:
          return; // Quit when this doesn't handle the key event.
      }
    },
    [moveCurrentRow]
  );

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
        className="CodeInput-Row-Input"
        style={{
          top: `${4 + 20 * activeRow}px`,
          left: `${25 + textSize}px`,
        }}
        value={""}
        onChange={handleValueChange}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};
