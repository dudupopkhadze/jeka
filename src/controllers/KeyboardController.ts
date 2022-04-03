import { CodeController } from "./CodeController";

export class KeyboardController {
  static handleKeyPress(
    key: string,
    activeRow: number,
    selectionOffset: number,
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
        return KeyboardController.handleArrowLeft(
          activeRow,
          selectionOffset,
          codeController
        );
      }
      case "Right": // IE/Edge specific value
      case "ArrowRight":
        return KeyboardController.handleArrowRight(
          activeRow,
          selectionOffset,
          codeController
        );

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

  static handleArrowLeft(
    activeRow: number,
    selectionOffset: number,
    codeController: CodeController
  ) {
    if (!codeController.getData(activeRow)) {
      return KeyboardController.handleArrowUp(activeRow, codeController);
    }

    return {
      activeRow: activeRow,
      value: codeController.getData(activeRow),
      selectionOffset: selectionOffset + 1,
    };
  }

  static handleArrowRight(
    activeRow: number,
    selectionOffset: number,
    codeController: CodeController
  ) {
    if (selectionOffset === 0) {
      return KeyboardController.handleSpace(activeRow, codeController);
    }

    return {
      activeRow: activeRow,
      value: codeController.getData(activeRow),
      selectionOffset: selectionOffset - 1,
    };
  }

  static handleArrowUp(activeRow: number, codeController: CodeController) {
    const nextValue = activeRow - 1;

    if (nextValue < 0) {
      return null;
    }
    return {
      activeRow: nextValue,
      value: codeController.getData(nextValue),
      selectionOffset: 0,
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
      selectionOffset: 0,
    };
  }

  static handleEnter(activeRow: number, codeController: CodeController) {
    codeController.insertRow(activeRow + 1);
    return {
      activeRow: activeRow + 1,
      value: codeController.getData(activeRow + 1),
      selectionOffset: 0,
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
      selectionOffset: 0,
    };
  }

  static handleSpace(activeRow: number, codeController: CodeController) {
    return {
      activeRow: activeRow,
      value: codeController.contact(" ", activeRow),
      selectionOffset: 0,
    };
  }

  static handleTab(activeRow: number, codeController: CodeController) {
    return {
      activeRow: activeRow,
      value: codeController.contact("    ", activeRow),
      selectionOffset: 0,
    };
  }
}
