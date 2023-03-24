import { useEffect, useRef, useState } from "react";
import { useBoard } from "../../hooks";
import "./style.css";

export const Board = () => {
  const { board } = useBoard();
  const [registered, setIsRegistered] = useState(false);
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!ref.current || registered) return;

    board.registerCanvas(ref.current);
    setIsRegistered(true);
  }, [registered]);

  useEffect(() => {
    if (!registered) return;
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
