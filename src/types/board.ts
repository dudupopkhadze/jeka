export interface IBoard {
  rows: number;
  columns: number;
}

export enum BoardSizeLabel {
  FourByFour = "4x4",
  FiveByFive = "5x5",
  SixBySix = "6x6",
  EightByEight = "8x8",
}

export type BoardConfig = IBoard & {
  label: BoardSizeLabel;
};
