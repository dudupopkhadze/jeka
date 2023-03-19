import { BoardController } from "../controllers";
import { JekaFacing, JekaInstruction } from "../types";

export class Engine {
  boardController: BoardController;
  private delay: number;

  constructor(boardController: BoardController, delay?: number) {
    this.boardController = boardController;
    this.delay = delay || 300;
  }

  async process(instructions: JekaInstruction[]) {
    if (!instructions.length) return;
    if (!this.boardController.isWorldInitialized()) {
      this.boardController.drawWorld();
      this.boardController.drawJekaOnStart();
    }

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      await new Promise((resolve) =>
        setTimeout(() => {
          this.processSingleInstruction(instruction);
          resolve(null);
        }, this.delay * i)
      );
    }
  }

  private processSingleInstruction(instruction: JekaInstruction) {
    switch (instruction) {
      case JekaInstruction.MOVE_FORWARD:
        this.processMoveForward();
        break;
      case JekaInstruction.TURN_LEFT:
        this.processTurnLeft();
        break;

      default:
        break;
    }
  }

  private processMoveForward() {
    const { row, column, facing } = this.boardController.getJekaCoordinates();
    const newRow = facing === JekaFacing.NORTH ? row : row + 1;
    const newColumn = facing === JekaFacing.NORTH ? column - 1 : column;
    this.boardController.drawJekaWithBoardPosition(newRow, newColumn);
  }

  private processTurnLeft() {
    const jekaPosition = this.boardController.getJekaCoordinates();
    this.boardController.drawJekaWithBoardPosition(
      jekaPosition.row,
      jekaPosition.column,
      -Math.PI / 2
    );
  }
}
