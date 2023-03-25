import {
  CANVAS_WIDTH,
  CIRCLE_DIAMETER,
  PADDING,
  CANVAS_HEIGHT,
  CIRCLE_RADIUS,
  OBSTACLE_WIDTH,
} from "../config";
import { Jeka } from "../engine/Jeka";
import { BoardConfig } from "../types";
import { jekaFacingToAngle } from "../utils";

export class Board {
  private canvas?: HTMLCanvasElement;
  private boardConfig: BoardConfig;
  private jeka?: Jeka;
  private isWordInitialized = false;
  private blockedRoutes = new Set<string>();

  constructor(boardConfig: BoardConfig) {
    this.boardConfig = boardConfig;
    this.blockedRoutesFromConfig();
  }

  setJeka = (jeka: Jeka) => {
    this.jeka = jeka;
  };

  setBoard(board: BoardConfig) {
    this.boardConfig = board;
    this.blockedRoutesFromConfig();
    if (this.jeka) this.jeka.setStartAt(0, this.boardConfig.columns - 1);
  }

  getBoardConfig() {
    return this.boardConfig;
  }

  registerCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  isWorldInitialized() {
    return this.isWordInitialized;
  }

  validateJekaMove(
    nextRow: number,
    nextColumn: number,
    cur?: { row: number; column: number }
  ) {
    if (nextRow < 0 || nextRow >= this.boardConfig.rows) return false;
    if (nextColumn < 0 || nextColumn >= this.boardConfig.columns) return false;
    if (cur) {
      return !this.blockedRoutes.has(
        `${cur.row},${cur.column}:${nextRow}${nextColumn}`
      );
    }
    return true;
  }

  drawJekaWithBoardPosition() {
    if (!this.jeka) return;
    if (this.isWordInitialized) {
      this.clearBoard();
      this.drawWorld();
    }

    const { row, column, facing } = this.jeka.boardCoordinates;

    const { x, y } = this.getJekaCoordinatesForRowAndColumn(row, column);

    const ctx = this.getContext();
    ctx.save();

    //handle what position jeka is facing

    ctx.translate(x + this.jeka.size / 2, y + this.jeka.size / 2);
    const newAngle = jekaFacingToAngle(facing);

    ctx.rotate(newAngle);
    ctx.translate(-x - this.jeka.size / 2, -y - this.jeka.size / 2);

    // draw the image
    // since the ctx is rotated, the image will be rotated also
    ctx.drawImage(this.jeka.svg, x, y);

    // we’re done with the rotating so restore the unrotated ctx
    ctx.restore();
  }

  clearBoard() {
    const ctx = this.getContext();
    ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    this.isWordInitialized = false;
  }

  drawWorld() {
    if (!this.jeka?.jekaSvgIsLoaded) return;

    this.drawDots();
    this.drawObstacles();

    this.isWordInitialized = true;
  }

  private drawDots() {
    const context = this.getContext();

    for (let i = 0; i < this.boardConfig.rows; i++) {
      for (let j = 0; j < this.boardConfig.columns; j++) {
        context.beginPath();
        const { x, y } = this.getBoardCellCoordinates(i, j);
        context.arc(x, y, CIRCLE_RADIUS, 0, Math.PI * 2, true);
        context.fill();
      }
    }
  }

  private blockedRoutesFromConfig = () => {
    if (!this.boardConfig.obstacles?.length) return;
    this.blockedRoutes.clear();
    this.boardConfig.obstacles.forEach((obstacle) => {
      this.blockedRoutes.add(
        `${obstacle.from.row},${obstacle.from.column}:${obstacle.to.row}${obstacle.to.column}`
      );
    });
  };

  private drawObstacles() {
    if (!this.boardConfig.obstacles) return;
    const context = this.getContext();
    for (const block of this.boardConfig.obstacles) {
      const { from, to } = block;

      const direction = from.row !== to.row ? "vertical" : "horizontal";

      context.beginPath(); // Start a new path

      if (direction === "vertical") {
        const start = this.getBoardCellCoordinatesForObstacle(
          from.row,
          from.column,
          true
        );
        const end = this.getBoardCellCoordinatesForObstacle(
          to.row,
          to.column + 1,
          true
        );

        const xOffset = (end.x - start.x) / 2;

        const yOffset = (end.y - start.y) / 2;
        context.moveTo(start.x + xOffset, start.y - yOffset);
        context.lineTo(start.x + xOffset, start.y + yOffset);
      } else {
        const start = this.getBoardCellCoordinatesForObstacle(
          from.row,
          from.column
        );
        const end = this.getBoardCellCoordinatesForObstacle(
          to.row + 1,
          to.column
        );

        const xOffset = (end.x - start.x) / 2;

        const yOffset = (start.y - end.y) / 2;
        context.moveTo(start.x - xOffset, end.y + yOffset);
        context.lineTo(start.x + xOffset, end.y + yOffset);
      }

      context.lineWidth = OBSTACLE_WIDTH;
      context.stroke();
      context.restore();
    }
  }

  private getContext() {
    const context = this.canvas?.getContext("2d");
    if (!context) throw new Error("No Context");
    return context;
  }

  private getBoardCellCoordinatesForObstacle(
    row: number,
    column: number,
    addRowPadding?: boolean
  ) {
    const { rows, columns } = this.boardConfig;

    const dx = CANVAS_WIDTH / (rows - 1);
    const dy = CANVAS_WIDTH / (columns - 1);

    const x =
      row === 0
        ? addRowPadding
          ? PADDING
          : 0
        : row === rows - 1
        ? CANVAS_WIDTH - (addRowPadding ? PADDING : 0)
        : dx * row;
    const y =
      column === 0
        ? 0
        : column === columns - 1
        ? CANVAS_HEIGHT - 0
        : dy * column;
    return { x, y };
  }

  private getBoardCellCoordinates(row: number, column: number) {
    const { rows, columns } = this.boardConfig;

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
    return { x: x - this.jeka!.size / 2, y: y - this.jeka!.size / 2 };
  };
}
