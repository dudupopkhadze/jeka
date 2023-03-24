import { LiteralValue, Token } from "./Token";

export abstract class Expression {
  abstract accept<T>(visitor: ExpressionVisitor<T>): T;
}

export interface ExpressionVisitor<T> {
  visitBinaryExpr(expr: Binary): T;
  visitUnaryExpr(expr: Unary): T;
  visitGroupingExpr(expr: Grouping): T;
  visitLiteralExpr(expr: Literal): T;
  visitVariableExpr(expr: Variable): T;
  visitAssignExpr(expr: Assign): T;
  visitLogicalExpr(expr: Logical): T;
  visitCallExpr(expr: Call): T;
}

export class Assign extends Expression {
  name: Token;
  value: Expression;

  constructor(name: Token, value: Expression) {
    super();
    this.name = name;
    this.value = value;
  }

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitAssignExpr(this);
  }
}

export class Variable extends Expression {
  name: Token;

  constructor(name: Token) {
    super();
    this.name = name;
  }

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitVariableExpr(this);
  }
}

export class Binary extends Expression {
  left: Expression;
  right: Expression;
  operator: Token;

  constructor(left: Expression, right: Expression, operator: Token) {
    super();
    this.left = left;
    this.right = right;
    this.operator = operator;
  }

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitBinaryExpr(this);
  }
}

export class Call extends Expression {
  paren: Token;
  callee: Expression;
  arguments: Expression[];

  constructor(paren: Token, callee: Expression, args: Expression[]) {
    super();
    this.paren = paren;
    this.callee = callee;
    this.arguments = args;
  }

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitCallExpr(this);
  }
}

export class Unary extends Expression {
  right: Expression;
  operator: Token;

  constructor(right: Expression, operator: Token) {
    super();
    this.right = right;
    this.operator = operator;
  }

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitUnaryExpr(this);
  }
}

export class Grouping extends Expression {
  expression: Expression;

  constructor(expression: Expression) {
    super();
    this.expression = expression;
  }

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitGroupingExpr(this);
  }
}

export class Literal extends Expression {
  value: LiteralValue;

  constructor(value: LiteralValue) {
    super();
    this.value = value;
  }

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitLiteralExpr(this);
  }
}

export class Logical extends Expression {
  left: Expression;
  right: Expression;
  operator: Token;

  constructor(left: Expression, right: Expression, operator: Token) {
    super();
    this.left = left;
    this.right = right;
    this.operator = operator;
  }

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitLogicalExpr(this);
  }
}
