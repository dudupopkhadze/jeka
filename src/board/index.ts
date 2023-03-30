import {
  CANVAS_WIDTH,
  CIRCLE_DIAMETER,
  PADDING,
  CANVAS_HEIGHT,
  CIRCLE_RADIUS,
  OBSTACLE_WIDTH,
} from "../config";
import { BoneManager } from "../engine/Bone";
import { Jeka } from "../engine/Jeka";
import { BoardConfig } from "../types";
import { jekaFacingToAngle } from "../utils";

export class Board {
  private canvas?: HTMLCanvasElement;
  private boardConfig: BoardConfig;
  private jeka?: Jeka;
  private boneManager?: BoneManager;
  private isWordInitialized = false;
  private blockedRoutes = new Set<string>();

  constructor(boardConfig: BoardConfig) {
    this.boardConfig = boardConfig;
    this.setupBlockedRoutesFromConfig();
  }

  registerJeka = (jeka: Jeka) => {
    this.jeka = jeka;
  };

  registerBoneManager = (boneManager: BoneManager) => {
    this.boneManager = boneManager;
    this.boneManager.updateProvidedLocations(this.boardConfig.boneLocations);
  };

  setBoard(board: BoardConfig) {
    this.boardConfig = board;
    this.setupBlockedRoutesFromConfig();
    if (this.boardConfig.boneLocations?.length)
      this.boneManager?.updateProvidedLocations(this.boardConfig.boneLocations);
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

    this.drawBones();

    this.isWordInitialized = true;
  }

  private drawBones() {
    if (!this.boneManager || !this.boardConfig.boneLocations?.length) return;
    const ctx = this.getContext();

    for (let i = 0; i < this.boardConfig.rows; i++) {
      for (let j = 0; j < this.boardConfig.columns; j++) {
        const bones = new Array(this.boneManager!.bonesAt(i, j)).fill(0);
        if (!bones.length) continue;
        const { x, y } = this.getJekaCoordinatesForRowAndColumn(i, j);

        ctx.drawImage(this.boneManager!.svg, x, y);

        if (bones.length > 1) {
          ctx.font = "15px Arial";
          ctx.fillText(`${bones.length}`, x + 20, y + 13);
        }
      }
    }
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

  private setupBlockedRoutesFromConfig = () => {
    this.blockedRoutes.clear();
    if (!this.boardConfig.obstacles?.length) {
      return;
    }

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
      const halObstacleWidth = (OBSTACLE_WIDTH - 1) / 2;

      const isVertical = from.row !== to.row;

      context.beginPath(); // Start a new path

      if (isVertical) {
        const start = this.getBoardCellCoordinates(from.row, from.column);
        const end = this.getBoardCellCoordinates(to.row, to.column + 1);

        const xOffset = (end.x - start.x - 5) / 2 + halObstacleWidth;

        const yOffset = (end.y - start.y) / 2;
        context.moveTo(start.x + xOffset, start.y - yOffset);
        context.lineTo(start.x + xOffset, start.y + yOffset);
      } else {
        const start = this.getBoardCellCoordinates(from.row, from.column);
        const end = this.getBoardCellCoordinates(to.row + 1, to.column);

        const xOffset = (end.x - start.x) / 2;

        const yOffset =
          (start.y - end.y - OBSTACLE_WIDTH - 1) / 2 + halObstacleWidth;

        context.moveTo(
          start.x - xOffset - halObstacleWidth - 1,
          end.y + yOffset
        );
        context.lineTo(start.x + xOffset + halObstacleWidth, end.y + yOffset);
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

  private getBoardCellCoordinates(row: number, column: number) {
    const { rows, columns } = this.boardConfig;

    const dx =
      (CANVAS_WIDTH - rows * CIRCLE_DIAMETER - 2 * PADDING) / (rows - 1);
    const dy =
      (CANVAS_HEIGHT - columns * CIRCLE_DIAMETER - 2 * PADDING) / (columns - 1);

    const x =
      row === 0
        ? PADDING + CIRCLE_RADIUS
        : row === rows - 1
        ? CANVAS_WIDTH - PADDING - CIRCLE_RADIUS
        : PADDING + dx * row + row * CIRCLE_DIAMETER + CIRCLE_RADIUS;

    const y =
      column === 0
        ? PADDING + CIRCLE_RADIUS
        : column === columns - 1
        ? CANVAS_HEIGHT - PADDING - CIRCLE_RADIUS
        : PADDING + dy * column + column * CIRCLE_DIAMETER + CIRCLE_RADIUS;
    return { x, y };
  }

  private getJekaCoordinatesForRowAndColumn = (row: number, column: number) => {
    const { x, y } = this.getBoardCellCoordinates(row, column);
    return { x: x - this.jeka!.size / 2, y: y - this.jeka!.size / 2 };
  };
}
