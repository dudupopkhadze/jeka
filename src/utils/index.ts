import { JekaFacing } from "../types";

export const measureText = (text: string, fontSize: number = 18) => {
  let lDiv: HTMLDivElement | null = document.createElement("div");

  document.body.appendChild(lDiv);

  lDiv.style.fontSize = "" + fontSize + "px";
  lDiv.style.position = "absolute";
  (lDiv as any).style.left = -1000;
  (lDiv as any).style.top = -1000;

  lDiv.textContent = text.replaceAll(" ", "i");

  var lResult = {
    width: lDiv.clientWidth,
    height: lDiv.clientHeight,
  };

  document.body.removeChild(lDiv);
  lDiv = null;

  return lResult;
};

export const arrayToString = (arr: string[]) => {
  let result = "";
  arr.forEach((str) => {
    result += `${str}\n`;
  });

  return result;
};

export const jekaFacingToAngle = (facing: JekaFacing) => {
  switch (facing) {
    case JekaFacing.EAST:
      return 0;
    case JekaFacing.WEST:
      return Math.PI;
    case JekaFacing.NORTH:
      return -Math.PI / 2;
    case JekaFacing.SOUTH:
      return Math.PI / 2;
  }
};

export const angleToJekaFacing = (angle: number) => {
  switch (angle) {
    case Math.PI:
      return JekaFacing.WEST;
    case -Math.PI / 2:
      return JekaFacing.NORTH;
    case Math.PI / 2:
      return JekaFacing.SOUTH;

    default:
      return JekaFacing.EAST;
  }
};
