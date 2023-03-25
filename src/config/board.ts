import { BoardConfig, BoardSizeLabel } from "../types";

export const CIRCLE_RADIUS = 3.5;
export const CIRCLE_DIAMETER = 2 * CIRCLE_RADIUS;
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 600;
export const PADDING = 30;
export const OBSTACLE_WIDTH = 5;

export const StartingBoardLabel = BoardSizeLabel.FourByFour;

export const BoardConfigs: BoardConfig[] = [
  {
    rows: 4,
    columns: 4,
    label: BoardSizeLabel.FourByFour,
    obstacles: [
      {
        from: {
          row: 1,
          column: 2,
        },
        to: {
          row: 2,
          column: 2,
        },
      },

      {
        from: {
          row: 1,
          column: 3,
        },
        to: {
          row: 2,
          column: 3,
        },
      },
    ],
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
    obstacles: [
      // {
      //   from: {
      //     row: 0,
      //     column: 3,
      //   },
      //   to: {
      //     row: 0,
      //     column: 2,
      //   },
      // },

      // {
      //   from: {
      //     row: 1,
      //     column: 3,
      //   },
      //   to: {
      //     row: 1,
      //     column: 2,
      //   },
      // },

      // {
      //   from: {
      //     row: 2,
      //     column: 3,
      //   },
      //   to: {
      //     row: 2,
      //     column: 2,
      //   },
      // },

      {
        from: {
          row: 2,
          column: 4,
        },
        to: {
          row: 2,
          column: 5,
        },
      },

      {
        from: {
          row: 1,
          column: 5,
        },
        to: {
          row: 2,
          column: 5,
        },
      },

      {
        from: {
          row: 3,
          column: 3,
        },
        to: {
          row: 3,
          column: 4,
        },
      },

      {
        from: {
          row: 2,
          column: 4,
        },
        to: {
          row: 3,
          column: 4,
        },
      },
      {
        from: {
          row: 4,
          column: 3,
        },
        to: {
          row: 4,
          column: 4,
        },
      },

      {
        from: {
          row: 4,
          column: 4,
        },
        to: {
          row: 5,
          column: 4,
        },
      },

      {
        from: {
          row: 4,
          column: 5,
        },
        to: {
          row: 5,
          column: 5,
        },
      },
    ],
  },
  {
    rows: 8,
    columns: 8,
    label: BoardSizeLabel.EightByEight,
  },
];
