import { Literal, Token } from "./Token";
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

  private scanToken() {
    const char = this.advance();

    switch (char) {
      case "(":
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case "}":
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case "{":
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case ";":
        this.addToken(TokenType.SEMICOLON);
        break;
      case " ":
      case "\r":
      case "\t":
        // Ignore whitespace.
        break;
      case "\n":
        this.line++;
        break;

      default:
        if (this.isAlpha(char)) {
          this.identifier();
        } else {
          console.log("ERROR");
          console.error(`${char} error on line ${this.line}`);
        }
        break;
    }
  }

  private addToken(token: TokenType) {
    this.addTokenObj(token, null);
  }

  private match(expected: string) {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;
    this.current++;
    return true;
  }

  private peekNext() {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source.charAt(this.current + 1);
  }

  private isAlpha(str: string) {
    return (
      (str.charAt(0) >= "a" && str.charAt(0) <= "z") ||
      (str.charAt(0) >= "A" && str.charAt(0) <= "Z") ||
      str.charAt(0) === "_"
    );
  }

  private isDigit(str: string) {
    const c = str.charAt(0);
    return c >= "0" && c <= "9";
  }

  private isAlphaNumeric(str: string) {
    return this.isAlpha(str) || this.isDigit(str);
  }

  private identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();
    const text = this.source.substring(this.start, this.current);
    let type = this.keywords.get(text);
    if (!type) {
      type = TokenType.IDENTIFIER;
    }
    this.addToken(type);
  }

  private advance() {
    this.current++;
    return this.source.charAt(this.current - 1);
  }

  private peek() {
    if (this.isAtEnd()) return "\0";
    return this.source.charAt(this.current);
  }

  private addTokenObj(token: TokenType, literal: Literal) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(token, text, literal, this.line));
  }

  private isAtEnd() {
    return this.current >= this.source.length;
  }
}
