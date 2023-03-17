import React, { useEffect, useRef } from "react";
import { useBoardController } from "../../hooks/useBoardController";
import "./style.css";

export const Board = () => {
  const { boardController } = useBoardController();
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    boardController.registerCanvas(ref.current);
  });

  return (
    <div className="Board-Container">
      <canvas
        height={600}
        width={600}
        ref={ref}
        className="Board-Container-Canvas"
      ></canvas>
    </div>
  );
};
