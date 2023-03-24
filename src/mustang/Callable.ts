import { Interpreter } from "./Interpreter";
import { LiteralValue } from "./Token";
import { Function } from "./Statement";
import { Environment } from "./Environment";
import { Return } from "./Return";

export enum FunctionType {
  NONE,
  FUNCTION,
}

export interface Callable {
  arity(): number;
  call(interpreter: Interpreter, args: LiteralValue[]): LiteralValue;
}

export class CallableFunc implements Callable {
  closure: Environment;
  declaration: Function;

  constructor(dec: Function, closure: Environment) {
    this.closure = closure;
    this.declaration = dec;
  }
  arity(): number {
    return this.declaration.params.length;
  }

  call(interpreter: Interpreter, args: unknown[]): unknown {
    const environment = new Environment(this.closure);
    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i]!.lexeme, args[i]);
    }
    try {
      interpreter.executeBlock(this.declaration.body, environment);
    } catch (error) {
      const err = error as Return;
      return err.value;
    }
    return null;
  }
}
