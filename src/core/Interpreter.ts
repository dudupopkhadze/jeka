import { Environment } from "./Environment";
import {
  Assign,
  Binary,
  Call,
  Expression,
  ExpressionVisitor,
  Grouping,
  Literal,
  Logical,
  Unary,
  Variable,
} from "./Expression";
import { Mustang } from ".";
import { RuntimeError } from "./RuntimeError";
import {
  Block,
  Expr,
  Function,
  If,
  Print,
  Statement,
  StatementVisitor,
  Var,
  While,
} from "./Statement";
import { LiteralValue, Token, TokenType } from "./Token";
import { Callable, CallableFunc } from "./Callable";
import { Return } from "./Return";

const defineJekaInstructions = (env: Environment) => {
  env.define(
    "moveForward",
    new (class implements Callable {
      arity(): number {
        return 0;
      }
      call(): unknown {
        console.log("moveForward");
        return;
      }
    })()
  );

  env.define(
    "turnLeft",
    new (class implements Callable {
      arity(): number {
        return 0;
      }
      call(): unknown {
        console.log("turnLeft");
        return;
      }
    })()
  );
};

export class Interpreter
  implements ExpressionVisitor<LiteralValue>, StatementVisitor<void>
{
  global: Environment;
  environment: Environment;
  locals: Record<string, { expr: Expression; depth: number }>;
  constructor() {
    this.global = new Environment();
    this.locals = {};

    defineJekaInstructions(this.global);
    this.environment = this.global;
  }

  resolve(id: string, expr: Expression, depth: number) {
    this.locals[id] = { expr, depth };
  }

  interpret(statements: Statement[]) {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      const err = error as RuntimeError;
      Mustang.runtimeError(err);
    }
  }

  visitFunctionStatement(stmt: Function): void {
    const func = new CallableFunc(stmt, this.environment);
    this.environment.define(stmt.name.lexeme, func);
    return;
  }

  visitCallExpr(expr: Call): unknown {
    const callee = this.evaluate(expr.callee);
    const args: LiteralValue[] = [];

    expr.arguments.forEach((arg) => args.push(this.evaluate(arg)));
    const func = callee as Callable;
    if (!func.arity || !func.call) {
      throw new RuntimeError(
        expr.paren,
        "Can only call functions and classes."
      );
    }

    if (args.length !== func.arity()) {
      throw new RuntimeError(
        expr.paren,
        "Expected " + func.arity() + " arguments but got " + args.length + "."
      );
    }

    return func.call(this, args);
  }

  visitWhileStatement(stmt: While): void {
    while (Boolean(this.evaluate(stmt.condition))) {
      this.execute(stmt.body);
    }
  }

  visitIfStatement(stmt: If): void {
    if (Boolean(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch);
    } else if (stmt.elseBranch !== null) {
      this.execute(stmt.elseBranch);
    }
  }

  visitLogicalExpr(expr: Logical): unknown {
    const left = this.evaluate(expr.left);
    if (expr.operator.type == TokenType.OR) {
      if (Boolean(left)) return left;
    } else {
      if (!Boolean(left)) return left;
    }
    return this.evaluate(expr.right);
  }

  visitBlockStatement(stmt: Block): void {
    this.executeBlock(stmt.statements, new Environment(this.environment));
  }

  visitAssignExpr(expr: Assign): unknown {
    const value = this.evaluate(expr.value);

    const record = this.locals[expr.name.toString()];

    if (record !== undefined) {
      this.environment.assignAt(record.depth, expr.name, value);
    } else {
      this.global.assign(expr.name, value);
    }

    return value;
  }

  visitVarStatement(stmt: Var): void {
    let value = null;
    if (stmt.initializer !== null) {
      value = this.evaluate(stmt.initializer);
    }
    this.environment.define(stmt.name.lexeme, value);
  }

  visitVariableExpr(expr: Variable): unknown {
    return this.lookupVariable(expr.name);
  }

  private lookupVariable(name: Token) {
    const record = this.locals[name.toString()];
    if (record !== undefined) {
      return this.environment.getAt(record.depth, name.lexeme);
    } else {
      return this.global.get(name);
    }
  }

  visitExpressionStatement(stmt: Expr): void {
    this.evaluate(stmt.expression);
  }

  visitPrintStatement(stmt: Print): void {
    const value = this.evaluate(stmt.expression);
    console.log(this.stringify(value));
  }

  visitLiteralExpr(expr: Literal): unknown {
    return expr.value;
  }

  visitGroupingExpr(expr: Grouping): unknown {
    return this.evaluate(expr.expression);
  }

  visitBinaryExpr(expr: Binary): unknown {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) - Number(right);
      case TokenType.PLUS: {
        if (typeof left === "number" && typeof right === "number") {
          return Number(left) + Number(right);
        }

        if (typeof left === "string" && typeof right === "string") {
          return String(left) + String(right);
        }

        throw new RuntimeError(
          expr.operator,
          "Operands must be two numbers or two strings"
        );
      }

      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) > Number(right);
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) >= Number(right);
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) < Number(right);
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) <= Number(right);

      case TokenType.BANG_EQUAL:
        return left !== right;
      case TokenType.EQUAL_EQUAL:
        return left === right;
    }

    return null;
  }

  visitUnaryExpr(expr: Unary): unknown {
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.BANG:
        return !Boolean(right);
      case TokenType.MINUS:
        this.checkNumberOperand(expr.operator, right);
        return -Number(right);
    }
    return null;
  }

  executeBlock(statements: Statement[], environment: Environment) {
    const previous = this.environment;
    try {
      this.environment = environment;
      statements.forEach((statement) => this.execute(statement));
    } finally {
      this.environment = previous;
    }
  }

  private execute(stmt: Statement) {
    stmt.accept(this);
  }

  private stringify(literal: LiteralValue) {
    if (literal === null) return "nil";

    if (typeof literal === "number") {
      return Number(literal).toString();
    }
    return `${literal}`;
  }

  private checkNumberOperand(operator: Token, operand: LiteralValue) {
    if (typeof operand === "number") return;
    throw new RuntimeError(operator, "Operand must be numbers.");
  }

  private checkNumberOperands(
    operator: Token,
    left: LiteralValue,
    right: LiteralValue
  ) {
    if (typeof left === "number" && typeof right === "number") return;
    throw new RuntimeError(operator, "Operands must be numbers.");
  }

  private evaluate(expr: Expression) {
    return expr.accept(this);
  }
}
