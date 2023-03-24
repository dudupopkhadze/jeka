import { BoardConfig, BoardSizeLabel } from "../types";

export const CIRCLE_RADIUS = 3.5;
export const CIRCLE_DIAMETER = 2 * CIRCLE_RADIUS;
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 600;
export const PADDING = 30;

export const StartingBoardLabel = BoardSizeLabel.FiveByFive;

export const BoardConfigs: BoardConfig[] = [
  {
    rows: 4,
    columns: 4,
    label: BoardSizeLabel.FourByFour,
  },
  {
    rows: 5,
    columns: 5,
    label: BoardSizeLabel.FiveByFive,
  },
  {
    rows: 6,
    columns: 6,
    label: BoardSizeLabel.SixBySix,
  },
  {
    rows: 8,
    columns: 8,
    label: BoardSizeLabel.EightByEight,
  },
];
