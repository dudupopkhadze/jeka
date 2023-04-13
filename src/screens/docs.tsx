import { CodeBlock, dracula } from "react-code-blocks";
import "../styles/Docs.css";

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
      {docs.map(({ code, command, description }) => (
        <div key={command} className="Docs-Section">
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
        </div>
      ))}
    </div>
  );
}
