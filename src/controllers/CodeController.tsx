const INITIAL_SIZE = 15;

export class CodeController {
  data: string[];
  c: number;
  constructor() {
    this.data = new Array(INITIAL_SIZE).fill("");
    this.c = 0;
    this.data[2] = "cool dude";
    this.data[0] = "hello ";

    this.data[6] = "function test";
    this.data[8] = "const a = 5;";
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

  grow() {
    const newArray = new Array(INITIAL_SIZE).fill("");
    this.data = [...this.data, ...newArray];
  }

  length() {
    return this.data.length;
  }
}
