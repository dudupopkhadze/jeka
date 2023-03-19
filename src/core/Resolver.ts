import { FunctionType } from "./Callable";
import {
  Assign,
  Binary,
  Call,
  Expression,
  ExpressionVisitor,
  Grouping,
  Logical,
  Unary,
  Variable,
} from "./Expression";
import { Interpreter } from "./Interpreter";
import { Mustang } from ".";
import { Stack } from "./Stack";
import {
  Block,
  Expr,
  Function,
  If,
  MoveForward,
  Print,
  Return,
  Statement,
  StatementVisitor,
  Var,
  While,
} from "./Statement";
import { Token } from "./Token";

export class Resolver
  implements StatementVisitor<void>, ExpressionVisitor<void>
{
  interpreter: Interpreter;
  scopes: Stack<Record<string, boolean>>;
  currentFunction: FunctionType = FunctionType.NONE;
  constructor(interpreter: Interpreter) {
    this.interpreter = interpreter;
    this.scopes = new Stack();
  }

  visitBlockStatement(stmt: Block): void {
    this.beginScope();
    this.resolve(stmt.statements);
    this.endScope();
  }

  visitVarStatement(stmt: Var): void {
    this.declare(stmt.name);

    if (stmt.initializer !== null) {
      this.resolveSingleExpression(stmt.initializer);
    }

    this.define(stmt.name);
  }

  visitVariableExpr(expr: Variable): void {
    if (
      !this.scopes.isEmpty() &&
      this.scopes.peek()![expr.name.lexeme] === false
    ) {
      Mustang.errorWithToken(
        expr.name,
        "Can't read local variable in its own initializer."
      );
    }
    this.resolveLocal(expr, expr.name);
  }

  visitAssignExpr(expr: Assign): void {
    this.resolveSingleExpression(expr.value);
    this.resolveLocal(expr, expr.name);
  }

  visitFunctionStatement(stmt: Function): void {
    this.declare(stmt.name);
    this.define(stmt.name);
    this.resolveFunction(stmt, FunctionType.FUNCTION);
  }

  visitExpressionStatement(stmt: Expr): void {
    this.resolveSingleExpression(stmt.expression);
  }

  visitIfStatement(stmt: If): void {
    this.resolveSingleExpression(stmt.condition);
    this.resolveSingleStatement(stmt.thenBranch);
    if (stmt.elseBranch !== null) this.resolveSingleStatement(stmt.elseBranch);
  }

  visitPrintStatement(stmt: Print): void {
    this.resolveSingleExpression(stmt.expression);
  }

  visitMoveForwardStatement(stmt: MoveForward): void {
    this.resolveSingleExpression(stmt.expression);
  }

  visitReturnStatement(stmt: Return): void {
    if (this.currentFunction === FunctionType.NONE) {
      Mustang.errorWithToken(stmt.keyword, "Can't return from top-level code.");
    }
    if (stmt.value !== null) {
      this.resolveSingleExpression(stmt.value);
    }
  }

  visitWhileStatement(stmt: While): void {
    this.resolveSingleExpression(stmt.condition);
    this.resolveSingleStatement(stmt.body);
  }

  visitBinaryExpr(expr: Binary): void {
    this.resolveSingleExpression(expr.left);
    this.resolveSingleExpression(expr.right);
  }

  visitCallExpr(expr: Call): void {
    this.resolveSingleExpression(expr.callee);
    expr.arguments.forEach((arg) => this.resolveSingleExpression(arg));
  }

  visitGroupingExpr(expr: Grouping): void {
    this.resolveSingleExpression(expr.expression);
  }

  visitLiteralExpr(): void {}

  visitLogicalExpr(expr: Logical): void {
    this.resolveSingleExpression(expr.left);
    this.resolveSingleExpression(expr.right);
  }

  visitUnaryExpr(expr: Unary): void {
    this.resolveSingleExpression(expr.right);
  }

  resolveFunction(func: Function, type: FunctionType) {
    const prevFunc = this.currentFunction;
    this.currentFunction = type;
    this.beginScope();
    func.params.forEach((p) => {
      this.declare(p);
      this.define(p);
    });
    this.resolve(func.body);
    this.endScope();
    this.currentFunction = prevFunc;
  }

  resolveLocal(expr: Expression, name: Token) {
    let finished = false;
    this.scopes.forEach((scope, i) => {
      if (finished) return;

      if (scope[name.lexeme] !== undefined) {
        this.interpreter.resolve(
          name.toString(),
          expr,
          this.scopes.length() - 1 - i
        );
        finished = true;
      }
    });
  }

  declare(name: Token) {
    if (this.scopes.isEmpty()) return;
    const scope = this.scopes.peek()!;

    if (scope[name.lexeme] !== undefined) {
      Mustang.errorWithToken(
        name,
        "Already variable with this name in this scope."
      );
    }

    scope[name.lexeme] = false;
  }

  define(name: Token) {
    if (this.scopes.isEmpty()) return;
    const scope = this.scopes.peek()!;
    scope[name.lexeme] = true;
  }

  resolve(stmts: Statement[]) {
    stmts.forEach((s) => this.resolveSingleStatement(s));
  }

  resolveSingleStatement(stmt: Statement) {
    stmt.accept(this);
  }

  resolveSingleExpression(expr: Expression) {
    expr.accept(this);
  }

  beginScope() {
    this.scopes.push({});
  }
  endScope() {
    this.scopes.pop();
  }
}
