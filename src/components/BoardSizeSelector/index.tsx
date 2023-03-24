import { useMemo } from "react";
import Select from "react-select";
import { BoardConfigs } from "../../config";
import { useBoardController, useEngine } from "../../hooks";
import "./style.css";

export const BoardSizeSelector = () => {
  const { resetEngineState } = useEngine();
  const { boardSize, updateBoardConfig } = useBoardController();
  const selectedOption = {
    label: boardSize + " Board",
    value: boardSize,
  };

  const options = useMemo(
    () =>
      BoardConfigs.map((v) => ({
        label: v.label + " Board",
        value: v.label,
      })),
    []
  );

  return (
    <div className="BoardSizeSelector">
      <Select
        value={selectedOption}
        isMulti={false}
        options={options}
        isSearchable={false}
        onChange={(v) => {
          if (!v?.value) return;
          updateBoardConfig(v.value);
          resetEngineState();
        }}
        styles={{ container: (base, state) => ({ ...base, width: 250 }) }}
      />

      <span className="BoardSizeSelector-Title">Select Board Size</span>
    </div>
  );
};
