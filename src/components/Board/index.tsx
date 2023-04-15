import { useEffect, useRef, useState } from "react";
import { useBoard } from "../../hooks";
import "./style.css";

export const Board = ({
  height,
  width,
  containerClassName,
  canvasClassName,
}: {
  height?: number;
  width?: number;
  containerClassName?: string;
  canvasClassName?: string;
}) => {
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
    <div className={containerClassName ?? "Board-Container"}>
      <canvas
        height={height ?? 600}
        width={width ?? 600}
        ref={ref}
        className={canvasClassName ?? "Board-Container-Canvas"}
      ></canvas>
    </div>
  );
};
