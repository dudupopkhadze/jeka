import {
  Assign,
  Binary,
  Call,
  Expression,
  Grouping,
  Literal,
  Logical,
  Unary,
  Variable,
} from "./Expression";
import { Mustang } from ".";
import { ParserError } from "./ParserError";
import {
  Block,
  Expr,
  Function,
  If,
  Print,
  Return,
  Statement,
  Var,
  While,
} from "./Statement";
import { Token, TokenType } from "./Token";

export class Parser {
  current: number;
  tokens: Token[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse() {
    try {
      const statements: Statement[] = [];
      while (!this.isAtEnd()) {
        statements.push(this.declaration()!);
      }
      return statements;
    } catch (error) {
      const err = error as ParserError;
      console.log(err);
      return null;
    }
  }

  private declaration() {
    try {
      if (this.match(TokenType.FUN)) return this.fun("function");
      if (this.match(TokenType.VAR)) return this.varDeclaration();
      return this.statement();
    } catch (error) {
      this.synchronize();
      return null;
    }
  }

  private fun(kind: string) {
    const name = this.consume(
      TokenType.IDENTIFIER,
      "Expect " + kind + " name."
    );

    this.consume(TokenType.LEFT_PAREN, "Expect '(' after " + kind + " name.");
    const parameters: Token[] = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (parameters.length >= 255) {
          this.error(this.peek(), "Can't have more than 255 parameters.");
        }
        parameters.push(
          this.consume(TokenType.IDENTIFIER, "Expect parameter name.")
        );
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after parameters.");

    this.consume(TokenType.LEFT_BRACE, "Expect '{' before " + kind + " body.");
    const body = this.block();
    return new Function(name, parameters, body);
  }

  private varDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Expect variable name.");

    let initializer = null;
    if (this.match(TokenType.EQUAL)) initializer = this.expression();

    this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");
    return new Var(name, initializer!);
  }

  private statement(): Statement {
    if (this.match(TokenType.FOR)) return this.forStatement();
    if (this.match(TokenType.IF)) return this.ifStatement();
    if (this.match(TokenType.PRINT)) return this.printStatement();
    if (this.match(TokenType.RETURN)) return this.returnStatement();
    if (this.match(TokenType.WHILE)) return this.whileStatement();
    if (this.match(TokenType.LEFT_BRACE)) return new Block(this.block());
    return this.expressionStatement();
  }

  private returnStatement() {
    const keyword = this.previous();
    let value = null;
    if (!this.check(TokenType.SEMICOLON)) {
      value = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expect ';' after return value.");
    return new Return(keyword, value!);
  }

  private forStatement() {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");
    let initializer;
    if (this.match(TokenType.SEMICOLON)) {
      initializer = null;
    } else if (this.match(TokenType.VAR)) {
      initializer = this.varDeclaration();
    } else {
      initializer = this.expressionStatement();
    }

    let condition = null;
    if (!this.check(TokenType.SEMICOLON)) {
      condition = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");

    let increment = null;
    if (!this.check(TokenType.RIGHT_PAREN)) {
      increment = this.expression();
    }
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");
    let body = this.statement();

    if (increment !== null) {
      body = new Block([body, new Expr(increment)]);
    }

    if (condition === null) condition = new Literal(true);
    body = new While(body, condition);

    if (initializer !== null) {
      body = new Block([initializer, body]);
    }

    return body;
  }

  private whileStatement() {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");
    const body = this.statement();
    return new While(body, condition);
  }

  private ifStatement() {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
    const condition = this.expression();

    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after 'if' condition.");
    const thenBranch = this.statement();

    let elseBranch: Statement | null = null;
    if (this.match(TokenType.ELSE)) {
      elseBranch = this.statement();
    }

    return new If(thenBranch, elseBranch!, condition);
  }

  private block() {
    const statements: Statement[] = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration()!);
    }

    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
    return statements;
  }

  private printStatement() {
    const value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expects ';' after value.");
    return new Print(value);
  }

  private expressionStatement() {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expects ';' after value.");
    return new Expr(expr);
  }

  private expression(): Expression {
    return this.assignment();
  }

  private assignment(): Expression {
    const expr = this.or();

    if (this.match(TokenType.EQUAL)) {
      const equals = this.previous();
      const value = this.assignment();

      if (expr instanceof Variable) {
        const name = expr.name;
        return new Assign(name, value);
      }

      this.error(equals, "Invalid assignment target.");
    }

    return expr;
  }

  private or() {
    let expr = this.and();

    while (this.match(TokenType.OR)) {
      const operator = this.previous();
      const right = this.and();
      return new Logical(expr, right, operator);
    }

    return expr;
  }

  private and() {
    let expr = this.equality();

    while (this.match(TokenType.AND)) {
      const operator = this.previous();
      const right = this.equality();
      return new Logical(expr, right, operator);
    }

    return expr;
  }

  private equality(): Expression {
    let expr = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new Binary(expr, right, operator);
    }

    return expr;
  }

  private comparison(): Expression {
    let expr = this.term();

    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL
      )
    ) {
      const operator = this.previous();
      const right = this.term();
      expr = new Binary(expr, right, operator);
    }

    return expr;
  }

  private term(): Expression {
    let expr = this.factor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous();
      const right = this.factor();
      expr = new Binary(expr, right, operator);
    }

    return expr;
  }

  private factor(): Expression {
    let expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator = this.previous();
      const right = this.unary();
      expr = new Binary(expr, right, operator);
    }

    return expr;
  }

  private unary(): Expression {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.unary();
      return new Unary(right, operator);
    }

    return this.call();
  }

  private call(): Expression {
    let expr = this.primary();
    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else break;
    }
    return expr;
  }

  private finishCall(callee: Expression) {
    const args: Expression[] = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (args.length > 255) {
          this.error(this.peek(), "Can't have more than 255 arguments.");
        }
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    const paren = this.consume(
      TokenType.RIGHT_PAREN,
      "Expect ')' after arguments."
    );
    return new Call(paren, callee, args);
  }

  private primary(): Expression {
    if (this.match(TokenType.FALSE)) return new Literal(false);
    if (this.match(TokenType.TRUE)) return new Literal(true);
    if (this.match(TokenType.NIL)) return new Literal(null);
    if (this.match(TokenType.NUMBER, TokenType.STRING))
      return new Literal(this.previous().literal);
    if (this.match(TokenType.IDENTIFIER)) {
      return new Variable(this.previous());
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, `Expect ")" after expression.`);
      return new Grouping(expr);
    }

    throw this.error(this.peek(), "Expect expression.");
  }

  private consume(type: TokenType, message: string) {
    if (this.check(type)) return this.advance();
    throw this.error(this.peek(), message);
  }

  private error(token: Token, message: string) {
    Mustang.errorWithToken(token, message);
    return new ParserError();
  }

  private synchronize() {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }

      this.advance();
    }
  }

  private match(...types: TokenType[]) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  private check(type: TokenType) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  private peek() {
    return this.tokens[this.current] as Token;
  }

  private previous() {
    return this.tokens[this.current - 1] as Token;
  }
}
