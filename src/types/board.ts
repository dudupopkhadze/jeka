export interface IBoard {
  rows: number;
  columns: number;
  boneLocations?: { row: number; column: number; count: number }[];
  obstacles?: {
    from: { row: number; column: number };
    to: { row: number; column: number };
  }[];
}

export enum BoardSizeLabel {
  TwoByTwo = "2x2",
  FourByFour = "4x4",
  FiveByFive = "5x5",
  SixBySix = "6x6",
  EightByEight = "8x8",
}

export type BoardConfig = IBoard & {
  label: BoardSizeLabel;
};
