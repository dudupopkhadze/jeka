import { Board } from "../types";

const CIRCLE_RADIUS = 5;
const CIRCLE_DIAMETER = 2 * CIRCLE_RADIUS;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const PADDING = 20;

export class BoardController {
  private canvas?: HTMLCanvasElement;
  private board: Board;

  constructor() {
    this.board = {
      rows: 5,
      columns: 5,
    };
  }

  registerCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  getContext() {
    const context = this.canvas?.getContext("2d");
    if (!context) throw new Error("No Context");
    return context;
  }

  getBoardCellCoordinates(row: number, column: number) {
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

  drawWorld() {
    const context = this.getContext();

    for (let i = 0; i < this.board.rows; i++) {
      for (let j = 0; j < this.board.columns; j++) {
        context.beginPath();
        const { x, y } = this.getBoardCellCoordinates(i, j);
        context.arc(x, y, CIRCLE_RADIUS, 0, Math.PI * 2, true);
        context.fill();
      }
    }
  }
}
