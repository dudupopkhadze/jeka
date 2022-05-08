import { TokenType } from "./TokenType";

export class Token {
  private type: TokenType;
  private lexeme: string;
  private literal: Object;
  private line: number;

  constructor(type: TokenType, lexeme: string, literal: Object, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString(): string {
    return this.type + " " + this.lexeme + " " + this.literal;
  }
}
