import { Compiler } from "../Compiler";

const INITIAL_SIZE = 15;

export class CodeController {
  private data: string[];
  private compiler;

  constructor() {
    this.data = new Array(INITIAL_SIZE).fill("");
    this.data[0] = "turnRight();";
    this.compiler = new Compiler();
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

  compile() {
    const source = this.data.join("\n");
    console.log(source);
    this.compiler.compile([source]);
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
