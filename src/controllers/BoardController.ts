export class BoardController {
  private canvas?: HTMLCanvasElement;

  registerCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  getContext() {
    const context = this.canvas?.getContext("2d");
    if (!context) throw new Error("No Context");
    return context;
  }

  drawBoard() {
    const context = this.getContext();
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        context.beginPath();
        const x = 20 + j * 50; // x coordinate
        const y = 20 + i * 50; // y coordinate
        const radius = 5; // Arc radius

        context.arc(x, y, radius, 0, Math.PI * 2, true);

        context.fill();
      }
    }
  }
}
