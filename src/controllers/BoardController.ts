import { Board } from "../types";

const CIRCLE_RADIUS = 5;
const CIRCLE_DIAMETER = 2 * CIRCLE_RADIUS;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const PADDING = 30;

const svg = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
 "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="50px" height="50px" viewBox="0 0 1280.000000 937.000000"
 preserveAspectRatio="xMidYMid meet">
<metadata>
Created by potrace 1.15, written by Peter Selinger 2001-2017
</metadata>
<g transform="translate(0.000000,937.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M10985 9233 c-56 -115 -145 -307 -192 -413 -15 -32 -192 -240 -341
-400 -137 -146 -313 -313 -429 -405 -74 -59 -88 -77 -154 -187 -40 -68 -98
-162 -130 -210 -80 -119 -284 -361 -365 -432 -85 -76 -150 -164 -170 -231 -8
-29 -21 -59 -29 -65 -8 -7 -36 -42 -62 -79 -120 -172 -162 -212 -233 -226 -49
-10 -127 -50 -177 -92 -24 -19 -43 -32 -43 -28 0 3 -13 -1 -29 -10 -64 -33
-213 -66 -424 -95 -224 -30 -339 -54 -393 -82 -16 -8 -67 -36 -114 -61 -145
-78 -289 -117 -595 -162 -344 -50 -526 -94 -733 -176 -42 -17 -151 -53 -242
-79 -193 -57 -311 -99 -470 -168 -170 -74 -270 -107 -499 -163 -214 -53 -260
-72 -473 -190 -48 -27 -143 -77 -210 -111 -68 -34 -154 -81 -192 -105 -83 -53
-243 -207 -339 -325 -39 -49 -74 -88 -79 -88 -19 0 -192 -210 -220 -268 -49
-99 -123 -158 -583 -463 -115 -77 -267 -179 -337 -227 -258 -177 -587 -346
-993 -510 -225 -90 -798 -300 -1100 -402 -110 -37 -246 -88 -302 -113 -112
-49 -249 -136 -301 -190 l-34 -35 59 -17 c32 -9 176 -55 321 -101 425 -136
498 -152 805 -175 816 -60 1528 198 2337 846 184 147 204 167 288 278 64 83
232 270 238 264 2 -2 45 -138 95 -303 153 -507 182 -643 161 -756 -15 -84 -74
-200 -166 -328 -42 -58 -97 -145 -123 -195 -47 -88 -48 -92 -48 -180 0 -83 3
-96 36 -166 20 -42 68 -123 107 -180 79 -119 90 -139 206 -382 56 -117 100
-194 129 -228 24 -27 83 -115 132 -196 48 -80 110 -172 137 -204 41 -50 56
-60 105 -74 81 -23 134 -65 253 -200 56 -64 114 -121 129 -127 61 -23 163 -21
311 6 80 15 177 31 217 35 87 10 122 33 155 99 32 65 38 229 11 317 -18 58
-20 60 -68 77 -28 9 -95 21 -150 27 -199 23 -200 23 -392 160 -146 105 -209
167 -224 224 -16 61 -53 130 -125 233 -76 110 -103 168 -111 245 l-6 59 44 44
c49 49 82 61 211 77 114 13 182 34 220 67 18 16 80 62 138 104 112 80 317 264
436 389 155 165 331 409 410 569 214 436 216 440 243 448 14 4 71 7 126 6 104
-1 139 -8 345 -70 106 -33 195 -54 372 -89 215 -43 633 -78 954 -78 l261 -1
13 -280 c8 -155 15 -365 16 -469 2 -103 7 -219 13 -257 6 -38 11 -120 11 -184
0 -116 16 -226 44 -304 12 -34 16 -82 15 -210 -2 -163 -1 -169 29 -250 17 -48
65 -139 111 -211 98 -155 125 -214 145 -311 29 -138 87 -220 155 -220 13 0 49
-12 79 -26 85 -40 218 -64 357 -65 179 0 294 29 371 95 21 18 51 36 66 40 38
9 68 44 68 78 0 31 -30 97 -52 115 -21 17 -314 162 -373 184 -85 32 -135 99
-150 203 -5 28 -21 70 -37 95 -49 78 -70 161 -75 306 -6 153 8 264 72 597 25
124 51 284 59 355 8 71 33 199 56 288 23 88 56 221 75 295 37 146 67 238 110
340 24 58 50 88 224 265 108 110 237 247 286 305 49 58 175 193 280 300 251
258 267 290 326 627 17 101 39 194 54 226 13 30 52 142 86 248 79 248 126 362
194 474 61 102 66 113 99 233 50 179 59 253 52 442 l-6 175 28 60 c16 33 50
93 75 133 l47 72 74 0 c41 0 101 6 133 14 32 8 135 17 228 21 232 9 293 19
378 60 40 19 79 38 87 43 8 5 54 28 102 52 101 50 121 69 218 209 83 120 93
155 61 218 -24 48 -74 90 -156 131 -33 16 -96 50 -140 76 -96 56 -209 100
-308 122 -148 33 -191 57 -249 142 -17 25 -44 77 -58 115 -38 97 -75 144 -182
232 -51 43 -126 113 -167 157 -80 86 -164 150 -253 194 l-56 27 -11 76 c-6 42
-18 150 -26 241 -16 194 -50 421 -66 453 -15 28 -40 57 -49 57 -5 0 -38 -62
-75 -137z"/>
</g>
</svg>
`;

export class BoardController {
  private canvas?: HTMLCanvasElement;
  private board: Board;
  private jeka?: HTMLImageElement;

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

  drawJeka(x: number, y: number) {
    const ctx = this.getContext();
    const img = new Image();
    const svg64 = btoa(svg);
    const b64Start = "data:image/svg+xml;base64,";
    const image64 = b64Start + svg64;
    img.src = image64;

    img.onload = () => {
      ctx.drawImage(img, x, y);
    };
  }

  clearBoard() {
    const ctx = this.getContext();
    ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
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

  drawTest() {
    this.clearBoard();
    this.drawWorld();
    this.drawJeka(PADDING - 25, CANVAS_HEIGHT - PADDING - 25);
  }
  drawTest2() {
    this.clearBoard();
    this.drawWorld();
    const dy = (CANVAS_WIDTH - 2 * CIRCLE_DIAMETER) / (this.board.columns - 1);
    this.drawJeka(PADDING - 25, dy * 1 + CIRCLE_DIAMETER - 25);
  }
}