export enum TokenType {
  // Single-character tokens.
  LEFT_PAREN = "LEFT_PAREN",
  RIGHT_PAREN = "RIGHT_PAREN",
  LEFT_BRACE = "LEFT_BRACE",
  RIGHT_BRACE = "RIGHT_BRACE",
  MINUS = "MINUS",
  PLUS = "PLUS",
  SEMICOLON = "SEMICOLON",
  COMMA = "COMMA",
  // One or two character tokens.
  BANG = "BANG",
  BANG_EQUAL = "BANG_EQUAL",
  EQUAL = "EQUAL",
  EQUAL_EQUAL = "EQUAL_EQUAL",
  GREATER = "GREATER",
  GREATER_EQUAL = "GREATER_EQUAL",
  LESS = "LESS",
  LESS_EQUAL = "LESS_EQUAL",
  // Literals.
  IDENTIFIER = "IDENTIFIER",
  NUMBER = "NUMBER",
  // Keywords.
  AND = "AND",
  ELSE = "ELSE",
  FALSE = "FALSE",
  FUN = "FUN",
  FOR = "FOR",
  IF = "IF",
  OR = "OR",
  PRINT = "PRINT",
  TRUE = "TRUE",
  VAR = "VAR",
  WHILE = "WHILE",
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
