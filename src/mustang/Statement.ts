import { Expression } from "./Expression";
import { Token } from "./Token";

export abstract class Statement {
  abstract accept<T>(visitor: StatementVisitor<T>): T;
}

export interface StatementVisitor<T> {
  visitExpressionStatement(stmt: Expr): T;
  visitPrintStatement(stmt: Print): T;
  visitVarStatement(stmt: Var): T;
  visitBlockStatement(stmt: Block): T;
  visitIfStatement(stmt: If): T;
  visitWhileStatement(stmt: While): T;
  visitFunctionStatement(stmt: Function): T;
}

export class Block extends Statement {
  statements: Statement[];

  constructor(statements: Statement[]) {
    super();
    this.statements = statements;
  }

  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitBlockStatement(this);
  }
}

export class Var extends Statement {
  name: Token;
  initializer: Expression;

  constructor(name: Token, initializer: Expression) {
    super();
    this.name = name;
    this.initializer = initializer;
  }

  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitVarStatement(this);
  }
}

export class Function extends Statement {
  name: Token;
  params: Token[];
  body: Statement[];

  constructor(name: Token, params: Token[], body: Statement[]) {
    super();
    this.name = name;
    this.params = params;
    this.body = body;
  }

  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitFunctionStatement(this);
  }
}

export class Expr extends Statement {
  expression: Expression;
  constructor(expression: Expression) {
    super();
    this.expression = expression;
  }

  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitExpressionStatement(this);
  }
}

export class Print extends Statement {
  expression: Expression;
  constructor(expression: Expression) {
    super();
    this.expression = expression;
  }

  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitPrintStatement(this);
  }
}

export class If extends Statement {
  thenBranch: Statement;
  elseBranch: Statement;
  condition: Expression;

  constructor(
    thenBranch: Statement,
    elseBranch: Statement,
    condition: Expression
  ) {
    super();
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
    this.condition = condition;
  }

  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitIfStatement(this);
  }
}

export class While extends Statement {
  body: Statement;
  condition: Expression;

  constructor(body: Statement, condition: Expression) {
    super();
    this.body = body;
    this.condition = condition;
  }

  accept<T>(visitor: StatementVisitor<T>): T {
    return visitor.visitWhileStatement(this);
  }
}
