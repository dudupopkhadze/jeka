import { useMemo, useState } from "react";
import Select from "react-select";
import { BoardConfigs } from "../../config";
import { useBoard, useEngine } from "../../hooks";
import { BoardSizeLabel } from "../../types";
import "./style.css";

export const BoardSizeSelector = () => {
  const { resetEngineState } = useEngine();
  const { boardSize, updateBoardConfig } = useBoard();
  const [obstaclesEnabled, setObstaclesEnabled] = useState(false);
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

  const hasObstacles = useMemo(
    () => !!BoardConfigs.find((v) => v.label === boardSize)?.obstacles?.length,
    [boardSize]
  );

  const updateBoard = ({
    providedLabel,
    obstacles,
  }: {
    providedLabel?: BoardSizeLabel;
    obstacles?: boolean;
  }) => {
    const obstaclesIsEnabled =
      obstacles === undefined ? obstaclesEnabled : obstacles;
    const value = providedLabel || boardSize;
    const config = BoardConfigs.find((v) => v.label === value);
    if (!config) return;
    updateBoardConfig({
      rows: config.rows,
      columns: config.columns,
      label: config.label,
      obstacles: obstaclesIsEnabled ? config.obstacles : [],
    });
    resetEngineState();
  };

  return (
    <div className="BoardSizeSelector">
      <Select
        value={selectedOption}
        isMulti={false}
        options={options}
        isSearchable={false}
        onChange={(v) => {
          if (!v?.value) return;
          updateBoard({ providedLabel: v.value as BoardSizeLabel });
        }}
        styles={{ container: (base, state) => ({ ...base, width: 250 }) }}
      />

      <span className="BoardSizeSelector-Title">Select Board Size</span>

      <div className="BoardSizeSelector-Checkbox ">
        <input
          type="checkbox"
          disabled={!hasObstacles}
          checked={obstaclesEnabled}
          onChange={(e) => {
            const newValue = !obstaclesEnabled;
            setObstaclesEnabled((cur) => !cur);
            updateBoard({ obstacles: newValue });
          }}
        />
        <span className="BoardSizeSelector-Checkbox-Label">Obstacles</span>
      </div>
    </div>
  );
};
