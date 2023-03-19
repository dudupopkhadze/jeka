import React, { useEffect, useRef, useState } from "react";
import { useBoardController } from "../../hooks/useBoardController";
import "./style.css";

export const Board = () => {
  const { boardController } = useBoardController();
  const [registered, setIsRegistered] = useState(false);
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!ref.current || registered) return;

    boardController.registerCanvas(ref.current);
    setIsRegistered(true);
  }, [registered]);

  useEffect(() => {
    if (!registered) return;

    boardController.drawWorld();
    boardController.drawJekaOnStart();
  }, [registered]);

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
