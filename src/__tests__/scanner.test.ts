import { Scanner } from "../Compiler/Scanner";

describe("Scanner Test", () => {
  test("test #1", () => {
    const source = "turnRight();";
    const onError = jest.fn();
    const scanner = new Scanner(source, onError);
    const tokens = scanner.scanTokens();
    expect(1).toBe(1);
  });

  test("test #2", () => {
    const source = "for(let i = 0; i < 5; i = i + 1) {}";
    const onError = jest.fn();
    const scanner = new Scanner(source, onError);
    const tokens = scanner.scanTokens();

    expect(tokens.length).toBe(20);
  });
});
