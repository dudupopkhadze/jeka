import { JekaCommand } from "../types";

const INITIAL_SIZE = 15;

const ValidCommands: { code: string; value: JekaCommand }[] = [
  { code: "turnRight", value: JekaCommand.TurnRight },
  { code: "moveForward", value: JekaCommand.MoveForward },
];

interface Function {
  name: string;
  commands: JekaCommand[];
}

interface CompilationError {
  line: number;
  token: string;
  description: string;
}

export class CodeController {
  private data: string[];

  constructor() {
    this.data = new Array(INITIAL_SIZE).fill("");
  }

  contact(v: string, index: number) {
    this.data[index] = this.getData(index) + v;
    return this.getData(index);
  }

  updateData(value: string, index: number) {
    this.data[index] = value;
    return value;
  }

  getData(index: number) {
    return this.data[index];
  }

  compile(): { commands: JekaCommand[] } {
    const commands: JekaCommand[] = [];
    const functions: Function[] = [];
    const errors: CompilationError[] = [];

    for (let i = 0; i < this.length(); i++) {
      const codeRow = this.getData(i);
      const tokens = codeRow.split(" ");
      tokens.forEach((t) => {
        console.log(t);
        const isCommand = ValidCommands.find(
          (e) => e.code === t.replace("()", "")
        );
        if (isCommand) {
          commands.push(isCommand.value);
          return;
        }

        const isFunction = functions.find(
          (f) => f.name === t.replace("(){", "")
        );

        if (isFunction) {
          commands.concat(isFunction.commands);
          return;
        }
      });
    }

    return { commands };
  }

  insertRow(index: number) {
    this.data.splice(index, 0, "");
  }

  grow() {
    const newArray = new Array(INITIAL_SIZE).fill("");
    this.data = [...this.data, ...newArray];
  }

  length() {
    return this.data.length;
  }
}
