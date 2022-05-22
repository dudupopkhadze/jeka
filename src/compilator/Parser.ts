import { Token } from "./Token";

export class Parser {
  private tokens;
  private current = 0;
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse() {
    console.log("dudu");
  }
}
