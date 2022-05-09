import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Scanner {
  private start = 0;
  private current = 0;
  private line = 1;
  private keywords: Map<string, TokenType> = new Map();
  source: string;
  tokens: Token[] = [];

  constructor(source: string) {
    this.source = source;
    this.setUpKeywords();
  }

  private setUpKeywords() {
    this.keywords.set("functions", TokenType.FUNCTION);
    this.keywords.set("else", TokenType.ELSE);
    this.keywords.set("if", TokenType.IF);
    this.keywords.set("while", TokenType.WHILE);
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }
    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
    return this.tokens;
  }

  private scanToken() {}

  private isAtEnd() {
    return this.current >= this.source.length;
  }
}
