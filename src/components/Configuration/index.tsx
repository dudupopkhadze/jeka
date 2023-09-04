import { BoardSizeSelector } from "../BoardSizeSelector";
import { DelaySlider } from "../DelaySlider";
import "./style.less";

export const Configuration = () => {
  return (
    <div className={"Configuration"}>
      <DelaySlider />
      <BoardSizeSelector />
    </div>
  );
};
