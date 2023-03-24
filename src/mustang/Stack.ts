export class Stack<T> {
  data: T[];
  constructor() {
    this.data = [];
  }

  push(value: T) {
    this.data.push(value);
  }

  pop() {
    return this.data.pop();
  }

  peek() {
    return this.data[this.data.length - 1];
  }

  forEach(fn: (value: T, i: number) => void) {
    this.data.forEach((value, i) => fn(value, i));
  }

  isEmpty() {
    return this.data.length === 0;
  }

  length() {
    return this.data.length;
  }
}
