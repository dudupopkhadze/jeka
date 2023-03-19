import { useState } from "react";
import { Delay } from "../../config";
import { useEngine } from "../../hooks";
import "./style.css";

export const DelaySlider = () => {
  const { setEngineProcessingDelay } = useEngine();
  const [value, setValue] = useState(Delay.DEFAULT);
  return (
    <div className="Slider-Container">
      <input
        type="range"
        min={Delay.MIN}
        max={Delay.MAX}
        onChange={(e) => {
          const value = Number(e.target.value);
          setValue(value);
          setEngineProcessingDelay(value);
        }}
        value={value}
        className="Slider"
      />
      <span className="Slider-Value">{`Delay: ${value}`}</span>
    </div>
  );
};
