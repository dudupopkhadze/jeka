import { BoardController } from "../controllers";

export enum Instruction {
  TURN_LEFT = "TURN_LEFT",
  MOVE_FORWARD = "MOVE_FORWARD",
}

export class Engine {
  boardController: BoardController;

  constructor(boardController: BoardController) {
    this.boardController = boardController;
  }

  process(instructions: Instruction[]) {
    console.log("Engine is processing", instructions);
  }

  private processSingleInstruction(instruction: Instruction) {
    console.log("Engine is processing single instruction", instruction);
  }
}
