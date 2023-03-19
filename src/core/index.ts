import { Interpreter } from "./Interpreter";
import { Parser } from "./Parser";
import { RuntimeError } from "./RuntimeError";
import { Scanner } from "./Scanner";
import { Token, TokenType } from "./Token";
import { Resolver } from "./Resolver";

export class Mustang {
  static interpreter = new Interpreter();
  static hadError: boolean = false;
  static hadRuntimeError = false;

  public run(input: string) {
    if (input) {
      const scanner = new Scanner(input);
      const tokens = scanner.scanTokens();

      const parser = new Parser(tokens);
      const statements = parser.parse()!;

      if (Mustang.hadError) {
        return;
      }
      if (Mustang.hadRuntimeError) {
        return;
      }

      const resolver = new Resolver(Mustang.interpreter);
      resolver.resolve(statements);

      if (Mustang.hadError) {
        return;
      }

      Mustang.interpreter.interpret(statements);
    }
  }

  static runtimeError(error: RuntimeError) {
    console.log(error.message + "\n[line " + error.token.line + "]");
    Mustang.hadRuntimeError = true;
  }

  static error(line: number, message: string) {
    this.report(line, "", message);
  }

  private static report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error  ${where}: ${message}`);
    this.hadError = true;
  }

  static errorWithToken(token: Token, message: string) {
    console.log("eRRRO");
    if (token.type === TokenType.EOF) {
      this.report(token.line, " at end", message);
    } else {
      this.report(token.line, " at '" + token.lexeme + "'", message);
    }
  }
}
