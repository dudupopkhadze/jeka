import { CodeController } from "./CodeController";

export class KeyboardController {
  static handleKeyPress(
    key: string,
    activeRow: number,
    codeController: CodeController
  ) {
    switch (key) {
      case "Down": // IE/Edge specific value
      case "ArrowDown":
        return KeyboardController.handleArrowDown(activeRow, codeController);

      case "Up": // IE/Edge specific value
      case "ArrowUp":
        return KeyboardController.handleArrowUp(activeRow, codeController);

      case "Left": // IE/Edge specific value
      case "ArrowLeft": {
        if (!codeController.getData(activeRow)) {
          return KeyboardController.handleArrowUp(activeRow, codeController);
        }

        return null;
      }
      case "Right": // IE/Edge specific value
      case "ArrowRight":
        return KeyboardController.handleSpace(activeRow, codeController);

      case "Enter":
        return KeyboardController.handleEnter(activeRow, codeController);

      case "Backspace":
        return KeyboardController.handleBackspace(activeRow, codeController);

      case "Space":
        return KeyboardController.handleSpace(activeRow, codeController);

      case "Tab":
        return KeyboardController.handleTab(activeRow, codeController);

      case "Esc": // IE/Edge specific value
      case "Escape":
        return null;
      default:
        return null; // Quit when this doesn't handle the key event.
    }
  }

  static handleArrowUp(activeRow: number, codeController: CodeController) {
    const nextValue = activeRow - 1;

    if (nextValue < 0) {
      return null;
    }
    return {
      activeRow: nextValue,
      value: codeController.getData(nextValue),
    };
  }

  static handleArrowDown(activeRow: number, codeController: CodeController) {
    const nextValue = activeRow + 1;

    if (nextValue >= codeController.length()) {
      codeController.grow();
    }
    return {
      activeRow: nextValue,
      value: codeController.getData(nextValue),
    };
  }

  static handleEnter(activeRow: number, codeController: CodeController) {
    codeController.insertRow(activeRow + 1);
    return {
      activeRow: activeRow + 1,
      value: codeController.getData(activeRow + 1),
    };
  }

  static handleBackspace(activeRow: number, codeController: CodeController) {
    const curValue = codeController.getData(activeRow);
    if (!curValue) return this.handleArrowUp(activeRow, codeController);
    return {
      activeRow: activeRow,
      value: codeController.updateData(
        curValue.substring(0, curValue.length - 1),
        activeRow
      ),
    };
  }

  static handleSpace(activeRow: number, codeController: CodeController) {
    return {
      activeRow: activeRow,
      value: codeController.contact(" ", activeRow),
    };
  }

  static handleTab(activeRow: number, codeController: CodeController) {
    return {
      activeRow: activeRow,
      value: codeController.contact("    ", activeRow),
    };
  }
}
