const script = require("../src/assets/js/script");

describe("Calculator Tests", () => {

  beforeAll(() => {
    // Silence console logs
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  beforeEach(() => {
    // Reset state before each test
    script.state.currentExpression = "";
    script.state.LAST_RESULT = 0;

    // Setup DOM (jsdom)
    document.body.innerHTML = `
      <input id="result" value="" />
      <button id="theme-toggle"></button>
    `;
  });

  // ------------------------------
  // Basic Input Tests
  // ------------------------------

  test("appendToResult should add numbers", () => {
    script.appendToResult(5);
    script.appendToResult(3);

    expect(script.state.currentExpression).toBe("53");
    expect(document.getElementById("result").value).toBe("53");
  });

  test("operatorToResult should add operator", () => {
    script.appendToResult(5);
    script.operatorToResult("+");
    script.appendToResult(2);

    expect(script.state.currentExpression).toBe("5+2");
  });

  test("clearResult should reset expression", () => {
    script.appendToResult(9);
    script.clearResult();

    expect(script.state.currentExpression).toBe("");
    expect(document.getElementById("result").value).toBe("0");
  });

  test("backspace should remove last character", () => {
    script.appendToResult(1);
    script.appendToResult(2);
    script.appendToResult(3);

    script.backspace();

    expect(script.state.currentExpression).toBe("12");
  });

  // ------------------------------
  // Expression Normalization
  // ------------------------------

  test("normalizeExpression should replace trig functions", () => {
    const expr = "sin(30) + cos(60)";
    const normalized = script.normalizeExpression(expr);

    expect(normalized).toContain("sinDeg(");
    expect(normalized).toContain("cosDeg(");
  });

  // ------------------------------
  // Calculation Tests
  // ------------------------------

  test("calculateResult should evaluate expression", () => {
    script.state.currentExpression = "2+3";

    script.calculateResult();

    expect(script.state.currentExpression).toBe("5");
    expect(script.state.LAST_RESULT).toBe(5);
  });

  test("calculateResult should handle ans keyword", () => {
    script.state.LAST_RESULT = 10;
    script.state.currentExpression = "ans + 5";

    script.calculateResult();

    expect(script.state.currentExpression).toBe("15");
  });

  test("calculateResult should handle invalid input", () => {
    script.state.currentExpression = "2++";

    script.calculateResult();

    expect(script.state.currentExpression).toBe("Error");
  });

  // ------------------------------
  // Percent Logic
  // ------------------------------

  test("percentToResult should convert simple number to percent", () => {
    script.state.currentExpression = "50";

    script.percentToResult();

    expect(script.state.currentExpression).toBe("0.5");
  });

  test("percentToResult should calculate percentage of expression", () => {
    script.state.currentExpression = "200*10";

    script.percentToResult();

    // 200 * 10% = 20, then "*" is appended
    expect(script.state.currentExpression).toBe("20");
  });

});