import React from "react";
import { CodeBlock, dracula } from "react-code-blocks";
import { ReactComponent as PlaySVG } from "../svgs/play.svg";
import "../styles/Docs.css";

import {
  CodeControllerContextProvider,
  BoardContextProvider,
  EngineContextProvider,
} from "../contexts";
import { Board } from "../components";
import { BoardConfigs } from "../config";
import { BoardConfig, BoardSizeLabel, JekaInstruction } from "../types";
import { useEngine } from "../hooks";

const docs = [
  {
    command: "moveForward",
    code: `//jeka moves forward \nmoveForward();`,
    description:
      "This command moves jeka forward with one pile in the facing direction",
    instructions: [JekaInstruction.MOVE_FORWARD],
    boardConfig: BoardConfigs.find(
      ({ label }) => label === BoardSizeLabel.TwoByTwo
    )!,
  },
  {
    command: "turnLeft",
    code: `//jeka turns left \nturnLeft();`,
    description: "This command turns jeka left from the facing direction",
    instructions: [JekaInstruction.TURN_LEFT],
    boardConfig: BoardConfigs.find(
      ({ label }) => label === BoardSizeLabel.TwoByTwo
    )!,
  },
  {
    command: "pickBone",
    code: `//jeka picks the bone \nmoveForward();\npickBone();`,
    description: "With this command jeka picks bone from the current pile",
    instructions: [JekaInstruction.MOVE_FORWARD, JekaInstruction.PICK_BONE],
    boardConfig: {
      ...BoardConfigs.find(({ label }) => label === BoardSizeLabel.TwoByTwo)!,
      boneLocations: [{ row: 1, column: 1, count: 1 }],
    } as unknown as BoardConfig,
  },
  {
    command: "putBone",
    code: `//jeka puts the bone \npickBone();\nmoveForward();\nputBone();`,
    description: "With this command jeka puts bone on the current pile",
    instructions: [
      JekaInstruction.PICK_BONE,
      JekaInstruction.MOVE_FORWARD,
      JekaInstruction.PUT_BONE,
    ],
    boardConfig: {
      ...BoardConfigs.find(({ label }) => label === BoardSizeLabel.TwoByTwo)!,
      boneLocations: [{ row: 0, column: 1, count: 1 }],
    } as unknown as BoardConfig,
  },
  {
    command: "360 degrees turn",
    code: `//jeka drifts \npickBone();\nmoveForward();\nputBone();`,
    description:
      "With this command jeka does 360 degree turn on the current pile ",
    instructions: [
      JekaInstruction.TURN_LEFT,
      JekaInstruction.TURN_LEFT,
      JekaInstruction.TURN_LEFT,
      JekaInstruction.TURN_LEFT,
    ],
    boardConfig: BoardConfigs.find(
      ({ label }) => label === BoardSizeLabel.TwoByTwo
    )!,
  },

  {
    command: "while(frontIsClear())",
    code: `//jeka runs \nwhile(frontIsClear()){\n  moveForward();\n}\nturnLeft();\nwhile(frontIsClear()){\n  moveForward();\n}\nturnLeft();\nwhile(frontIsClear()){\n  moveForward();\n}\nturnLeft();\nwhile(frontIsClear()){\n  moveForward();\n}\nturnLeft();`,
    description: "With this command jeka moves forward until front is clear",
    instructions: [],
    input:
      "while(frontIsClear()){\n  moveForward();\n}\nturnLeft();\nwhile(frontIsClear()){\n  moveForward();\n}\nturnLeft();\nwhile(frontIsClear()){\n  moveForward();\n}\nturnLeft();\nwhile(frontIsClear()){\n  moveForward();\n}\nturnLeft();",
    boardConfig: BoardConfigs.find(
      ({ label }) => label === BoardSizeLabel.TwoByTwo
    )!,
  },
];

export default function Docs() {
  return (
    <div className="Docs">
      <span className="Docs-Logo">🐶</span>
      <h1 className="Docs-Title">Welcome to the Jeka API</h1>
      {docs.map(
        (
          { code, command, description, instructions, boardConfig, input },
          i
        ) => (
          <React.Fragment key={command}>
            {i !== 0 && <hr className="Docs-Hr" />}
            <div className="Docs-Section">
              <p className="Docs-Section-Title">
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

              <DemoWrapper
                instructions={instructions}
                boardConfig={boardConfig}
                input={input}
              />
            </div>
          </React.Fragment>
        )
      )}
    </div>
  );
}

const DemoWrapper = ({
  instructions,
  boardConfig,
  input,
}: {
  instructions: JekaInstruction[];
  boardConfig: BoardConfig;
  input?: string;
}) => {
  return (
    <CodeControllerContextProvider>
      <BoardContextProvider
        startingConfig={boardConfig}
        height={200}
        width={200}
      >
        <EngineContextProvider>
          <Demo instructions={instructions} input={input} />
        </EngineContextProvider>
      </BoardContextProvider>
    </CodeControllerContextProvider>
  );
};

const Demo = ({
  instructions,
  input,
}: {
  instructions: JekaInstruction[];
  input?: string;
}) => {
  const { processDirectInstructions, resetEngineState, processInput } =
    useEngine();

  return (
    <div className="Docs-Board-Container">
      <div className="Docs-Board-Controls">
        <button
          onClick={() =>
            input
              ? processInput(input)
              : processDirectInstructions(instructions)
          }
          className="Header-Compile"
        >
          <PlaySVG className="Header-Compile-Icon" />
          Execute
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
