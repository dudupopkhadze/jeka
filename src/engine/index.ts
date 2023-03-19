import { BoardController } from "../controllers";
import { JekaFacing, JekaInstruction } from "../types";
import { angleToJekaFacingWithCurrentFacing } from "../utils";

type ErrorHandler = (error: string | null) => void;
export class Engine {
  boardController: BoardController;
  private delay: number;
  private error: string | null = null;
  private onError: ErrorHandler;
  private timeouts: NodeJS.Timeout[] = [];

  constructor(
    boardController: BoardController,
    onError: ErrorHandler,
    delay?: number
  ) {
    this.boardController = boardController;
    this.delay = delay || 500;
    this.onError = onError;
  }

  async process(instructions: JekaInstruction[], reset = true) {
    if (!instructions.length) return;
    if (reset) this.prepareForExecution();

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      await new Promise((resolve) => {
        this.timeouts.push(
          setTimeout(() => {
            if (this.error) {
              return resolve(null);
            }
            this.processSingleInstruction(instruction);
            resolve(null);
          }, this.delay * i)
        );
      });
    }
  }

  reset() {
    this.prepareForExecution();
  }

  private prepareForExecution() {
    this.boardController.clearJekaCoordinates();
    this.boardController.clearBoard();
    this.boardController.drawWorld();
    this.boardController.drawJekaOnStart();
    this.clearErrorState();
    if (this.timeouts.length) {
      this.timeouts.forEach((timeout) => clearTimeout(timeout));
      this.timeouts = [];
    }
  }

  private setErrorState(error: string) {
    this.error = error;
    this.onError(error);
  }

  private handleError(error: string) {
    this.setErrorState(error);
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
  }

  private clearErrorState() {
    this.error = null;
    this.onError(null);
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

  private getJekaNewRowForFacing(facing: JekaFacing) {
    switch (facing) {
      case JekaFacing.NORTH:
        return 0;
      case JekaFacing.EAST:
        return 1;
      case JekaFacing.SOUTH:
        return 0;
      case JekaFacing.WEST:
        return -1;
    }
  }

  private getJekaNewColumnForFacing(facing: JekaFacing) {
    switch (facing) {
      case JekaFacing.NORTH:
        return -1;
      case JekaFacing.EAST:
        return 0;
      case JekaFacing.SOUTH:
        return 1;
      case JekaFacing.WEST:
        return 0;
    }
  }

  private processMoveForward() {
    const { row, column, facing } = this.boardController.getJekaCoordinates();
    const newRow = this.getJekaNewRowForFacing(facing) + row;
    const newColumn = this.getJekaNewColumnForFacing(facing) + column;

    const isValid = this.boardController.validateJekaMove(newRow, newColumn);
    if (!isValid) {
      return this.handleError("Jeka cannot move forward");
    }

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
