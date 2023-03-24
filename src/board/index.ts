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

  constructor(boardConfig: BoardConfig) {
    this.boardConfig = boardConfig;
  }

  setJeka = (jeka: Jeka) => {
    this.jeka = jeka;
  };

  setBoard(board: BoardConfig) {
    this.boardConfig = board;
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

  validateJekaMove(nextRow: number, nextColumn: number) {
    if (nextRow < 0 || nextRow >= this.boardConfig.rows) return false;
    if (nextColumn < 0 || nextColumn >= this.boardConfig.columns) return false;
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
    this.drawVerticalLines();
    this.drawHorizontalLines();

    this.isWordInitialized = true;
  }

  private drawDots() {
    const context = this.getContext();

    // draw dots
    for (let i = 0; i < this.boardConfig.rows; i++) {
      for (let j = 0; j < this.boardConfig.columns; j++) {
        context.beginPath();
        const { x, y } = this.getBoardCellCoordinates(i, j);
        context.arc(x, y, CIRCLE_RADIUS, 0, Math.PI * 2, true);
        context.fill();
      }
    }
  }

  private drawHorizontalLines() {
    const context = this.getContext();
    if (this.boardConfig.horizontalLines) {
      for (const line of this.boardConfig.horizontalLines) {
        for (let i = 0; i < this.boardConfig.rows; i++) {
          for (let j = 0; j < this.boardConfig.columns; j++) {
            if (i === line.afterRow && j === line.afterColumn) {
              const startCoordinates1 = this.getBoardCellCoordinates(
                i,
                j,
                false
              );
              const startCoordinates2 = this.getBoardCellCoordinates(
                i + 1,
                j + 1,
                false
              );

              const yStart =
                startCoordinates1.y -
                (startCoordinates1.y - startCoordinates2.y) / 2;

              const xStart = startCoordinates1.x;

              const xDiff = (startCoordinates2.x - startCoordinates1.x) / 2;

              context.beginPath(); // Start a new path
              context.moveTo(xStart - xDiff, yStart);

              context.lineTo(xStart + xDiff, yStart);
              context.lineWidth = OBSTACLE_WIDTH;
              context.stroke();
              context.restore();
            }
          }
        }
      }
    }
  }

  private drawVerticalLines() {
    const context = this.getContext();
    if (this.boardConfig.verticalLines) {
      for (const line of this.boardConfig.verticalLines) {
        for (let i = 0; i < this.boardConfig.rows; i++) {
          for (let j = 0; j < this.boardConfig.columns; j++) {
            if (i === line.afterRow && j === line.afterColumn) {
              const startCoordinates1 = this.getBoardCellCoordinates(
                i,
                j,
                false
              );
              const startCoordinates2 = this.getBoardCellCoordinates(
                i + 1,
                j + 1,
                false
              );

              const offset =
                line.afterColumn === this.boardConfig.columns - 1 ? 30 : 0;

              const yStart =
                startCoordinates1.y +
                (startCoordinates1.y - startCoordinates2.y) / 2 +
                offset;
              const yEnd = startCoordinates2.y + offset;

              const xStart =
                startCoordinates1.x +
                (startCoordinates2.x - startCoordinates1.x) / 2 -
                OBSTACLE_WIDTH / 2;

              context.beginPath(); // Start a new path
              context.moveTo(xStart, yStart);
              context.lineTo(xStart, yEnd);
              context.lineWidth = OBSTACLE_WIDTH;
              context.stroke();
              context.restore();
            }
          }
        }
      }
    }
  }

  private getContext() {
    const context = this.canvas?.getContext("2d");
    if (!context) throw new Error("No Context");
    return context;
  }

  private getBoardCellCoordinates(
    row: number,
    column: number,
    addCircleRadius = true
  ) {
    const { rows, columns } = this.boardConfig;
    const diameter = addCircleRadius ? CIRCLE_DIAMETER : 0;

    const dx = (CANVAS_WIDTH - 2 * diameter) / (rows - 1);
    const dy = (CANVAS_WIDTH - 2 * diameter) / (columns - 1);

    const x =
      row === 0
        ? PADDING
        : row === rows - 1
        ? CANVAS_WIDTH - PADDING
        : dx * row + diameter;
    const y =
      column === 0
        ? PADDING
        : column === columns - 1
        ? CANVAS_HEIGHT - PADDING
        : dy * column + diameter;
    return { x, y };
  }

  private getJekaCoordinatesForRowAndColumn = (row: number, column: number) => {
    const { x, y } = this.getBoardCellCoordinates(row, column);
    return { x: x - this.jeka!.size / 2, y: y - this.jeka!.size / 2 };
  };
}
