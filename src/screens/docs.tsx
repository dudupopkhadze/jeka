import { CodeBlock, dracula } from "react-code-blocks";
import "../styles/Docs.css";
import React, { useEffect } from "react";
import { ReactComponent as PlaySVG } from "../svgs/play.svg";

import {
  CodeControllerContextProvider,
  BoardContextProvider,
  EngineContextProvider,
} from "../contexts";
import { Board } from "../components";
import { BoardConfigs } from "../config";
import { BoardSizeLabel, JekaInstruction } from "../types";
import { useEngine } from "../hooks";

const docs = [
  {
    command: "moveForward",
    code: `//move forward command \nmoveForward();`,
    description:
      "This command moves jeka forward with one pile in the facing direction",
  },
  {
    command: "turnRight",
    code: `//turns jeka right \nturnRight();`,
    description: "This command turn jeka right from the facing direction",
  },
  {
    command: "putBone",
    code: `//turns jeka right \nputBone();`,
    description: "This command turn jeka right from the facing direction",
  },
  {
    command: "pickBone",
    code: `//turns jeka right \npickBone();`,
    description: "This command turn jeka right from the facing direction",
  },
];

export default function Docs() {
  return (
    <div className="Docs">
      <span className="Docs-Logo">🐶</span>
      <h1 className="Docs-Title">Welcome to the Jeka API</h1>
      {docs.map(({ code, command, description }, i) => (
        <React.Fragment key={command}>
          {i !== 0 && <hr className="Docs-Hr" />}
          <div className="Docs-Section">
            <p className="Docs-Section-Title">
              Command name -{" "}
              <span className="Docs-Section-Title-Command"> {command} </span>
            </p>
            <div className="Docs-Section-Code">
              <CodeBlock
                text={code}
                language="javascript"
                theme={dracula}
                showLineNumbers
              />
            </div>

            <p className="Docs-Section-Description ">{description}</p>

            {i === 0 && <ExampleWrapper />}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

const ExampleWrapper = () => {
  return (
    <CodeControllerContextProvider>
      <BoardContextProvider
        startingConfig={
          BoardConfigs.find(({ label }) => label === BoardSizeLabel.TwoByTwo)!
        }
        height={200}
        width={200}
      >
        <EngineContextProvider>
          <Example />
        </EngineContextProvider>
      </BoardContextProvider>
    </CodeControllerContextProvider>
  );
};

const Example = () => {
  const { processDirectInstructions, resetEngineState } = useEngine();

  return (
    <div className="Docs-Board-Container">
      <div className="Docs-Board-Controls">
        <button
          onClick={() =>
            processDirectInstructions([JekaInstruction.MOVE_FORWARD])
          }
          className="Header-Compile"
        >
          <PlaySVG className="Header-Compile-Icon" />
          Run
        </button>
        <button
          onClick={() => resetEngineState()}
          className="Header-Compile Docs-Board-Controls-Control "
        >
          Reset
        </button>
      </div>
      <div className="Docs-Board-Wrapper">
        <Board
          containerClassName="Docs-Board"
          canvasClassName="Docs-Board-Canvas"
          width={200}
          height={200}
        />
      </div>
    </div>
  );
};
