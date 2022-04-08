import { JekaCommand } from "../types";

const INITIAL_SIZE = 15;

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

  compile(): JekaCommand[] {
    console.log(this.data);
    return [];
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
