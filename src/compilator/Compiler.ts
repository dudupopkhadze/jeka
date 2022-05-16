import { Scanner } from "./Scanner";

export class Compiler {
  compile(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    tokens.forEach((p) => console.log(p.toString()));
  }
}
