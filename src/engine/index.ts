import { BoardController } from "../controllers";
import { JekaInstruction } from "../types";

export class Engine {
  boardController: BoardController;

  constructor(boardController: BoardController) {
    this.boardController = boardController;
  }

  process(instructions: JekaInstruction[]) {
    console.log("Engine is processing", instructions);
  }

  private processSingleInstruction(instruction: JekaInstruction) {
    console.log("Engine is processing single instruction", instruction);
  }
}
