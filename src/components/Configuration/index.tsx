import { BoardSizeSelector } from "../BoardSizeSelector";
import { DelaySlider } from "../DelaySlider";
import "./style.css";

export const Configuration = () => {
  return (
    <div className={"Configuration"}>
      <DelaySlider />
      <BoardSizeSelector />
    </div>
  );
};
