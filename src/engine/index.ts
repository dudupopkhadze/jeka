import { Board } from "../board";
import { MAX_WHILE_LOOP } from "../config";
import { Mustang } from "../mustang";
import { Environment } from "../mustang/Environment";
import { AvailableAudio, JekaFacing, JekaInstruction } from "../types";
import {
  angleToJekaFacing,
  generateRandomId,
  jekaFacingToAngle,
} from "../utils";
import { AudioManager } from "./AudioManager";
import { Jeka } from "./Jeka";

type ErrorHandler = (error: string | null) => void;

interface Config {
  board: Board;
  onError: ErrorHandler;
  delay?: number;
}

export class Engine {
  private mustang: Mustang;
  private board: Board;
  private audioManager: AudioManager;
  private delay: number;
  private error: string | null = null;
  private onError: ErrorHandler;
  private timeouts: { id: string; timeout: NodeJS.Timeout }[] = [];
  private jeka: Jeka;
  private jekaCallbackFired = false;
  private frontIsClearCalledTimes = 0;

  constructor(config: Config) {
    this.audioManager = new AudioManager();
    this.mustang = new Mustang(
      this.initJekaEnvironment.bind(this),
      config.onError
    );
    this.board = config.board;
    this.delay = config.delay || 500;
    this.onError = config.onError;

    this.jeka = new Jeka({
      onLoad: this.onJekaLoad.bind(this),
      onError: () => {
        this.onError("Jeka failed to load, refresh the page");
      },
      startAt: {
        row: 0,
        column: this.board.getBoardConfig().columns - 1,
      },
    });

    this.board.setJeka(this.jeka);
  }

  private onJekaLoad = () => {
    if (this.jekaCallbackFired) return;

    this.jekaCallbackFired = true;
    this.prepareForExecution();
  };

  private initJekaEnvironment(env: Environment) {
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
        //ideally we should determine this in real time according to input
        if (this.frontIsClearCalledTimes > MAX_WHILE_LOOP) {
          this.setErrorState("Possible infinite loop detected");
          return;
        }
        this.frontIsClearCalledTimes++;
        const { isValid } = this.canJekaMoveForwardRealTime();

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
    this.frontIsClearCalledTimes = 0;
    if (this.timeouts.length) {
      this.timeouts.forEach(({ timeout }) => clearTimeout(timeout));
      this.timeouts = [];
    }
    this.jeka.resetCoordinates();
    this.board.clearBoard();
    this.board.drawWorld();
    this.board.drawJekaWithBoardPosition();
    this.clearErrorState();
    this.mustang.clearState();
  }

  private setErrorState(error: string) {
    this.error = error;
    this.onError(error);
  }

  private handleError(error: string) {
    this.timeouts.forEach(({ timeout }) => clearTimeout(timeout));
    this.timeouts = [];
    this.setErrorState(error);
  }

  private clearErrorState() {
    this.error = null;
    this.onError(null);
  }

  private updateLiveLocationByInstruction(instruction: JekaInstruction) {
    switch (instruction) {
      case JekaInstruction.MOVE_FORWARD:
        const newRow =
          this.getJekaNewRowForFacing(this.jeka.liveCoordinates.facing) +
          this.jeka.liveCoordinates.row;
        const newColumn =
          this.getJekaNewColumnForFacing(this.jeka.liveCoordinates.facing) +
          this.jeka.liveCoordinates.column;
        this.jeka.liveCoordinates = {
          ...this.jeka.liveCoordinates,
          row: newRow,
          column: newColumn,
        };
        break;
      case JekaInstruction.TURN_LEFT:
        this.jeka.liveCoordinates = {
          ...this.jeka.liveCoordinates,
          facing: angleToJekaFacing(
            jekaFacingToAngle(this.jeka.liveCoordinates.facing) - Math.PI / 2
          ),
        };
        break;

      default:
        break;
    }
  }

  private delayedProcessSingleInstruction(instruction: JekaInstruction) {
    this.updateLiveLocationByInstruction(instruction);
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

  private canJekaMoveForwardRealTime() {
    const { row, column, facing } = this.jeka.liveCoordinates;
    const newRow = this.getJekaNewRowForFacing(facing) + row;
    const newColumn = this.getJekaNewColumnForFacing(facing) + column;

    const isValid = this.board.validateJekaMove(newRow, newColumn);
    return { newRow, newColumn, isValid };
  }

  private canJekaMoveForward() {
    const { row, column, facing } = this.jeka.boardCoordinates;
    const newRow = this.getJekaNewRowForFacing(facing) + row;
    const newColumn = this.getJekaNewColumnForFacing(facing) + column;

    const isValid = this.board.validateJekaMove(newRow, newColumn);
    return { newRow, newColumn, isValid };
  }

  private processMoveForward() {
    const { isValid, newRow, newColumn } = this.canJekaMoveForward();

    if (!isValid) {
      return this.handleError("Jeka cannot move forward");
    }

    this.jeka.boardCoordinates = {
      ...this.jeka.boardCoordinates,
      row: newRow,
      column: newColumn,
    };

    this.board.drawJekaWithBoardPosition();
  }

  private processTurnLeft() {
    const jekaPosition = this.jeka.boardCoordinates;
    this.jeka.boardCoordinates = {
      ...jekaPosition,
      facing: angleToJekaFacing(
        jekaFacingToAngle(jekaPosition.facing) - Math.PI / 2
      ),
    };

    this.board.drawJekaWithBoardPosition();
  }
}
