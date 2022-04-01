export const measureText = (text: string, fontSize: number = 18) => {
  let lDiv: HTMLDivElement | null = document.createElement("div");

  document.body.appendChild(lDiv);

  lDiv.style.fontSize = "" + fontSize + "px";
  lDiv.style.position = "absolute";
  (lDiv as any).style.left = -1000;
  (lDiv as any).style.top = -1000;

  lDiv.textContent = text;

  var lResult = {
    width: lDiv.clientWidth,
    height: lDiv.clientHeight,
  };

  document.body.removeChild(lDiv);
  lDiv = null;

  return lResult;
};
