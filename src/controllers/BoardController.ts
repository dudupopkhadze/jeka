import {
  CANVAS_WIDTH,
  CIRCLE_DIAMETER,
  PADDING,
  CANVAS_HEIGHT,
  JEKA_SIZE,
  CIRCLE_RADIUS,
  JekaSVG,
} from "../config";
import { Board, JekaFacing } from "../types";
import { angleToJekaFacing, jekaFacingToAngle } from "../utils";

export class BoardController {
  private canvas?: HTMLCanvasElement;
  private board: Board;
  private jeka?: HTMLImageElement;
  private isWordInitialized = false;
  private jekaCoordinates = {
    x: 0,
    y: 0,
    row: 0,
    column: 0,
    facing: JekaFacing.EAST,
  };
  private jekaImageIsLoaded = false;

  constructor() {
    this.board = {
      rows: 5,
      columns: 5,
    };

    this.jeka = new Image();

    const svg64 = btoa(JekaSVG);
    const b64Start = "data:image/svg+xml;base64,";
    const image64 = b64Start + svg64;
    this.jeka.src = image64;
    this.jeka.onerror = () => {
      alert("load error");
    };
    this.jeka.onload = () => {
      this.jekaImageIsLoaded = true;
    };
  }

  registerCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  getJekaCoordinates() {
    return this.jekaCoordinates;
  }

  isWorldInitialized() {
    return this.isWordInitialized;
  }

  validateJekaMove(nextRow: number, nextColumn: number) {
    if (nextRow < 0 || nextRow >= this.board.rows) return false;
    if (nextColumn < 0 || nextColumn >= this.board.columns) return false;
    return true;
  }

  drawJekaWithBoardPosition(row: number, column: number, angle?: number) {
    if (this.isWordInitialized) {
      this.clearBoard();
      this.drawWorld();
    }

    const { x, y } = this.getJekaCoordinatesForRowAndColumn(row, column);

    const ctx = this.getContext();
    ctx.save();

    //handle what position jeka is facing

    ctx.translate(x + JEKA_SIZE / 2, y + JEKA_SIZE / 2);
    const newAngle = angle
      ? this.calculateNewJekaAngle(angle)
      : jekaFacingToAngle(this.jekaCoordinates.facing);
    ctx.rotate(newAngle);
    ctx.translate(-x - JEKA_SIZE / 2, -y - JEKA_SIZE / 2);

    this.jekaCoordinates = {
      x,
      y,
      row,
      column,
      facing: angleToJekaFacing(newAngle),
    };

    // draw the image
    // since the ctx is rotated, the image will be rotated also
    ctx.drawImage(this.jeka!, x, y);

    // we’re done with the rotating so restore the unrotated ctx
    ctx.restore();
  }

  clearBoard() {
    const ctx = this.getContext();
    ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);

    this.jekaCoordinates = {
      x: 0,
      y: 0,
      row: 0,
      column: 0,
      facing: JekaFacing.EAST,
    };

    this.isWordInitialized = false;
  }

  drawWorld() {
    if (!this.jekaImageIsLoaded) return;
    const context = this.getContext();

    for (let i = 0; i < this.board.rows; i++) {
      for (let j = 0; j < this.board.columns; j++) {
        context.beginPath();
        const { x, y } = this.getBoardCellCoordinates(i, j);
        context.arc(x, y, CIRCLE_RADIUS, 0, Math.PI * 2, true);
        context.fill();
      }
    }

    this.isWordInitialized = true;
  }

  drawJekaOnStart() {
    this.drawJekaWithBoardPosition(0, this.board.columns - 1);
  }

  private getContext() {
    const context = this.canvas?.getContext("2d");
    if (!context) throw new Error("No Context");
    return context;
  }

  private getBoardCellCoordinates(row: number, column: number) {
    const { rows, columns } = this.board;

    const dx = (CANVAS_WIDTH - 2 * CIRCLE_DIAMETER) / (rows - 1);
    const dy = (CANVAS_WIDTH - 2 * CIRCLE_DIAMETER) / (columns - 1);

    const x =
      row === 0
        ? PADDING
        : row === rows - 1
        ? CANVAS_WIDTH - PADDING
        : dx * row + CIRCLE_DIAMETER;
    const y =
      column === 0
        ? PADDING
        : column === columns - 1
        ? CANVAS_HEIGHT - PADDING
        : dy * column + CIRCLE_DIAMETER;
    return { x, y };
  }

  private getJekaCoordinatesForRowAndColumn = (row: number, column: number) => {
    const { x, y } = this.getBoardCellCoordinates(row, column);
    return { x: x - JEKA_SIZE / 2, y: y - JEKA_SIZE / 2 };
  };

  private calculateNewJekaAngle(angle: number) {
    const curAngle = jekaFacingToAngle(this.jekaCoordinates.facing);
    const newAngle = curAngle + angle;
    return newAngle;
  }
}
