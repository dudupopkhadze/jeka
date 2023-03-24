import { BoardController } from "../controllers";
import { Mustang } from "../mustang";
import { Environment } from "../mustang/Environment";
import { AvailableAudio, JekaFacing, JekaInstruction } from "../types";
import { generateRandomId } from "../utils";
import { AudioManager } from "./AudioManager";

type ErrorHandler = (error: string | null) => void;
export class Engine {
  private mustang: Mustang;
  private boardController: BoardController;
  private audioManager: AudioManager;
  private delay: number;
  private error: string | null = null;
  private onError: ErrorHandler;
  private timeouts: { id: string; timeout: NodeJS.Timeout }[] = [];

  constructor(
    boardController: BoardController,
    onError: ErrorHandler,
    delay?: number
  ) {
    this.audioManager = new AudioManager();
    this.mustang = new Mustang(this.initJekaEnvironment.bind(this), onError);
    this.boardController = boardController;
    this.delay = delay || 500;
    this.onError = onError;
  }

  private initJekaEnvironment(env: Environment) {
    let called = false;
    env.define(JekaInstruction.WOOF, {
      arity: () => {
        return 0;
      },
      call: () => {
        this.delayedProcessSingleInstruction(JekaInstruction.WOOF);
      },
    });

    env.define(JekaInstruction.MOVE_FORWARD, {
      arity: () => {
        return 0;
      },
      call: () => {
        this.delayedProcessSingleInstruction(JekaInstruction.MOVE_FORWARD);
      },
    });

    env.define(JekaInstruction.TURN_LEFT, {
      arity: () => {
        return 0;
      },
      call: () => {
        this.delayedProcessSingleInstruction(JekaInstruction.TURN_LEFT);
      },
    });

    env.define(JekaInstruction.FRONT_IS_CLEAR, {
      arity: () => {
        return 0;
      },
      call: () => {
        if (called) return;
        const { isValid } = this.canJekaMoveForward();
        console.log("isValid", isValid);
        called = true;
        return isValid;
      },
    });
  }

  async process(input: string) {
    this.prepareForExecution();
    this.mustang.run(input);
  }

  async processDirect(instructions: JekaInstruction[], reset = true) {
    if (!instructions.length) return;
    if (reset) this.prepareForExecution();

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      this.delayedProcessSingleInstruction(instruction);
    }
  }

  reset() {
    this.prepareForExecution();
  }

  setDelay(delay: number) {
    this.delay = delay;
  }

  private prepareForExecution() {
    this.boardController.clearJekaCoordinates();
    this.boardController.clearBoard();
    this.boardController.drawWorld();
    this.boardController.drawJekaOnStart();
    this.clearErrorState();
    this.mustang.clearState();
    if (this.timeouts.length) {
      this.timeouts.forEach(({ timeout }) => clearTimeout(timeout));
      this.timeouts = [];
    }
  }

  private setErrorState(error: string) {
    this.error = error;
    this.onError(error);
  }

  private handleError(error: string) {
    this.setErrorState(error);
    this.timeouts.forEach(({ timeout }) => clearTimeout(timeout));
    this.timeouts = [];
  }

  private clearErrorState() {
    this.error = null;
    this.onError(null);
  }

  private delayedProcessSingleInstruction(instruction: JekaInstruction) {
    new Promise((resolve) => {
      const id = generateRandomId();
      this.timeouts.push({
        id,
        timeout: setTimeout(() => {
          if (this.error) {
            return resolve(null);
          }
          this.processSingleInstruction(instruction);
          this.timeouts = this.timeouts.filter((t) => t.id !== id);
          resolve(null);
        }, this.delay * this.timeouts.length),
      });
    });
  }

  private processSingleInstruction(instruction: JekaInstruction) {
    switch (instruction) {
      case JekaInstruction.MOVE_FORWARD:
        this.processMoveForward();
        break;
      case JekaInstruction.TURN_LEFT:
        this.processTurnLeft();
        break;
      case JekaInstruction.WOOF:
        this.processWoof();
        break;

      default:
        break;
    }
  }

  private processWoof() {
    this.audioManager.play(AvailableAudio.WOOF);
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

  private canJekaMoveForward() {
    const { row, column, facing } = this.boardController.getJekaCoordinates();
    const newRow = this.getJekaNewRowForFacing(facing) + row;
    const newColumn = this.getJekaNewColumnForFacing(facing) + column;

    const isValid = this.boardController.validateJekaMove(newRow, newColumn);
    return { newRow, newColumn, isValid };
  }

  private processMoveForward() {
    const { isValid, newRow, newColumn } = this.canJekaMoveForward();

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
