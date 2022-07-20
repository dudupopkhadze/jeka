export enum TokenType {
  LEFT_PAREN = "LEFT_PAREN ",
  RIGHT_PAREN = "RIGHT_PAREN",
  LEFT_BRACE = "LEFT_BRACE",
  RIGHT_BRACE = "RIGHT_BRACE",
  SEMICOLON = "SEMICOLON",
  MINUS = "MINUS",
  PLUS = "PLUS",
  BANG = "BANG",
  BANG_EQUAL = "BANG_EQUAL",
  EQUAL = "EQUAL",
  EQUAL_EQUAL = "EQUAL_EQUAL",
  GREATER = "GREATER",
  GREATER_EQUAL = "GREATER_EQUAL",
  LESS = "LESS",
  LESS_EQUAL = "LESS_EQUAL",
  FOR = "FOR",
  WHILE = "WHILE",
  LET = "LET",
  IDENTIFIER = "IDENTIFIER",
  ELSE = "ELSE",
  FUNCTION = "FUNCTION",
  NUMBER = "NUMBER",
  IF = "IF",
  EOF = "EOF",
}

export type LiteralValue = unknown;

export class Token {
  type: TokenType;
  lexeme: string;
  literal: LiteralValue;
  line: number;

  constructor(
    type: TokenType,
    lexeme: string,
    literal: LiteralValue,
    line: number
  ) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  public toString() {
    return `${this.type}  ${this.lexeme} ${this.literal} + ${this.line};`;
  }
}
