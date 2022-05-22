import { Token } from "./Token";

interface Statement {}

export class Function implements Statement {
  private name: Token;
  private body: Statement[];
  constructor(name: Token, body: Statement[]) {
    this.name = name;
    this.body = body;
  }
}
