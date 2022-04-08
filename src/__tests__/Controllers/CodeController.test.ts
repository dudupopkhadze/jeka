import { CodeController } from "../../controllers";

describe("CodeController", () => {
  test("constructor", () => {
    const cur = new CodeController();

    expect(cur.length).toBe(15);
  });
});
