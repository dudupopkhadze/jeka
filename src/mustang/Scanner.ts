import { Mustang } from ".";
import { LiteralValue, Token, TokenType } from "./Token";

export class Scanner {
  start = 0;
  current = 0;
  line = 1;
  source: string;
  result: Token[];
  keywords: Record<string, TokenType> = {
    and: TokenType.AND,
    else: TokenType.ELSE,
    false: TokenType.FALSE,
    for: TokenType.FOR,
    fun: TokenType.FUN,
    if: TokenType.IF,
    or: TokenType.OR,
    print: TokenType.PRINT,
    true: TokenType.TRUE,
    var: TokenType.VAR,
    while: TokenType.WHILE,
  };

  constructor(source: string) {
    this.source = source;
    this.result = [];
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.result.push(new Token(TokenType.EOF, "", null, this.line));

    return this.result;
  }

  private scanToken() {
    const c = this.advance();
    switch (c) {
      case "(":
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN);
        break;

      case "{":
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case "}":
        this.addToken(TokenType.RIGHT_BRACE);
        break;

      case "-":
        this.addToken(TokenType.MINUS);
        break;
      case "+":
        this.addToken(TokenType.PLUS);
        break;
      case ";":
        this.addToken(TokenType.SEMICOLON);
        break;
      case ",":
        this.addToken(TokenType.COMMA);
        break;

      case "!":
        this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case "=":
        this.addToken(
          this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
        );
        break;
      case "<":
        this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER
        );
        break;

      // @ts-ignore
      case "/": {
        if (this.match("/")) {
          while (this.peek() !== "\n" && !this.isAtEnd()) this.advance();
          break;
        }
      }

      case " ":
      case "\r":
      case "\t":
        // Ignore whitespace.
        break;
      case "\n":
        this.line++;
        break;

      default: {
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          Mustang.error(this.line, "Unexpected character.");
        }
        break;
      }
    }
  }

  private identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    let type: TokenType = TokenType.IDENTIFIER;
    const text = this.source.substring(this.start, this.current);
    const possibleKeyword = this.keywords[text];
    if (possibleKeyword) {
      type = possibleKeyword;
    }
    this.addToken(type);
  }

  private isAlphaNumeric(c: string) {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private isAlpha(c: string) {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
  }

  private number() {
    while (this.isDigit(this.peek())) this.advance();
    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      this.advance();
      while (this.isDigit(this.peek())) this.advance();
    }
    this.addTokenWithLiteral(
      TokenType.NUMBER,
      Number(this.source.substring(this.start, this.current))
    );
  }

  private isDigit(str: string) {
    return str >= "0" && str <= "9";
  }

  private peekNext() {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source.charAt(this.current + 1);
  }

  private peek() {
    if (this.isAtEnd()) return "\0";
    return this.source.charAt(this.current);
  }

  private match(expected: string) {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;
    this.current++;
    return true;
  }

  private addToken(type: TokenType) {
    this.addTokenWithLiteral(type, null);
  }
  private addTokenWithLiteral(type: TokenType, literal: LiteralValue) {
    const text = this.source.substring(this.start, this.current);
    this.result.push(new Token(type, text, literal, this.line));
  }

  private advance() {
    this.current++;
    return this.source.charAt(this.current - 1);
  }

  private isAtEnd() {
    return this.current >= this.source.length;
  }
}
