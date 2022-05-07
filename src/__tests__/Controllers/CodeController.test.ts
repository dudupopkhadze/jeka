import { CodeController } from "../../controllers";
import { JekaCommand } from "../../types";

const dummyArray = (length: number) => new Array(length).fill(0);

describe("CodeController", () => {
  test("constructor", () => {
    const cur = new CodeController();

    expect(cur.length()).toBe(15);
    dummyArray(15).forEach((_, i) => {
      expect(cur.getData(i)).toBe("");
    });
  });

  test("updateData + getData", () => {
    const cur = new CodeController();

    cur.updateData("test", 5);

    dummyArray(15).forEach((_, i) => {
      expect(cur.getData(i)).toBe(i === 5 ? "test" : "");
    });
  });

  test("insertRow", () => {
    const cur = new CodeController();

    cur.updateData("test", 5);
    cur.insertRow(4);

    dummyArray(15).forEach((_, i) => {
      expect(cur.getData(i)).toBe(i === 6 ? "test" : "");
    });
  });

  test("grow", () => {
    const cur = new CodeController();

    cur.updateData("test", 5);
    cur.grow();

    dummyArray(30).forEach((_, i) => {
      expect(cur.getData(i)).toBe(i === 5 ? "test" : "");
    });
  });

  test("concat", () => {
    const cur = new CodeController();

    cur.updateData("test", 5);

    dummyArray(15).forEach((_, i) => {
      expect(cur.getData(i)).toBe(i === 5 ? "test" : "");
    });

    cur.contact("a", 5);

    dummyArray(15).forEach((_, i) => {
      expect(cur.getData(i)).toBe(i === 5 ? "testa" : "");
    });
  });
});

describe("CodeController.compile", () => {
  test("empty", () => {
    const cur = new CodeController();

    const res = cur.compile();

    expect(res.commands).toEqual([]);
  });

  test("2r", () => {
    const cur = new CodeController();

    cur.updateData("turnRight()", 0);
    cur.updateData("turnRight()", 4);

    const { commands } = cur.compile();
    expect(commands).toEqual([JekaCommand.TurnRight, JekaCommand.TurnRight]);
  });

  test("r f 2r", () => {
    const cur = new CodeController();

    cur.updateData("turnRight()", 0);
    cur.updateData("moveForward()", 2);
    cur.updateData("turnRight()", 4);
    cur.updateData("turnRight()", 6);

    const { commands } = cur.compile();
    expect(commands).toEqual([
      JekaCommand.TurnRight,
      JekaCommand.MoveForward,
      JekaCommand.TurnRight,
      JekaCommand.TurnRight,
    ]);
  });

  test("f 2r", () => {
    const cur = new CodeController();

    cur.updateData("moveForward()", 2);
    cur.updateData("turnRight()", 4);
    cur.updateData("turnRight()", 6);

    const { commands } = cur.compile();
    expect(commands).toEqual([
      JekaCommand.MoveForward,
      JekaCommand.TurnRight,
      JekaCommand.TurnRight,
    ]);
  });

  test("function", () => {
    const cur = new CodeController();

    cur.updateData("function test(){", 2);
    cur.updateData("turnRight()", 5);
    cur.updateData("}", 6);
    cur.updateData("test()", 7);
    cur.updateData("test()", 8);

    const { commands } = cur.compile();
    expect(commands).toEqual([JekaCommand.TurnRight, JekaCommand.TurnRight]);
  });

  test("2 function", () => {
    const cur = new CodeController();

    cur.updateData("function test(){", 2);
    cur.updateData("turnRight()", 5);
    cur.updateData("}", 6);

    cur.updateData("function test2(){", 7);
    cur.updateData("moveForward()", 8);
    cur.updateData("}", 9);
    cur.updateData("test()", 10);
    cur.updateData("test()", 11);
    cur.updateData("test2()", 12);

    const { commands } = cur.compile();
    expect(commands).toEqual([
      JekaCommand.TurnRight,
      JekaCommand.TurnRight,
      JekaCommand.TurnRight,
    ]);
  });
});
