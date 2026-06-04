// ===============================
// 🧠 SMART RESULT MEMORY FEATURE
// ===============================
const state = {
  currentExpression: "",
  LAST_RESULT: 0
};

// ------------------------------
// Theme Toggle Logic
// ------------------------------
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    btn.innerHTML = "☀️";
    btn.title = "Switch to light mode";
    localStorage.setItem("theme", "dark");
  } else {
    btn.innerHTML = "🌙";
    btn.title = "Switch to dark mode";
    localStorage.setItem("theme", "light");
  }
}
// Set theme on page load from localStorage
window.addEventListener("DOMContentLoaded", function () {
  const theme = localStorage.getItem("theme");
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  if (btn) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      btn.innerHTML = "☀️";
      btn.title = "Switch to light mode";
    } else {
      btn.innerHTML = "🌙";
      btn.title = "Switch to dark mode";
    }
  }
});

// ------------------------------
// Calculator State
// ------------------------------
let left = "";
let operator = "";
let right = "";
let steps = [];
const MAX_STEPS = 6;

// ------------------------------
// Basic Calculator Functions
// ------------------------------
function appendToResult(value) {
  state.currentExpression += value.toString();
  updateResult();
}

function bracketToResult(value) {
  state.currentExpression += value;
  updateResult();
}

function backspace() {
  state.currentExpression = state.currentExpression.slice(0, -1);
  updateResult();
}

function operatorToResult(value) {
  if (value === "^") {
    state.currentExpression += "**";
  } else {
    state.currentExpression += value;
  }
  updateResult();
}

function clearResult() {
  state.currentExpression = "";
  updateResult();
}


function normalizeExpression(expr) {
  return expr
    .replace(/asin\(/g, "asinDeg(")
    .replace(/acos\(/g, "acosDeg(")
    .replace(/atan\(/g, "atanDeg(")
    .replace(/sin\(/g, "sinDeg(")
    .replace(/cos\(/g, "cosDeg(")
    .replace(/tan\(/g, "tanDeg(")
    .replace(/asinh\(/g, "asinh(")
    .replace(/sinh\(/g, "sinh(")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bpi\b/g, "Math.PI");
}

function percentToResult() {
  if (!state.currentExpression) return;

  const match = state.currentExpression.match(/(.+?)(\*\*|[+\-*/^])([0-9.]*)$/);

  if (!match) {
    const num = parseFloat(state.currentExpression);
    if (isNaN(num)) return;

    state.currentExpression = (num / 100).toString();
  } else {
    const leftPart = match[1];
    const rightPart = match[3];

    if (!rightPart) return;

    let leftVal;

    try {
      leftVal = eval(leftPart);
    } catch (e) {
      leftVal = parseFloat(leftPart);
    }

    const rightVal = parseFloat(rightPart);
    if (isNaN(leftVal) || isNaN(rightVal)) return;

    const percentVal = (leftVal * rightVal) / 100;

    state.currentExpression = percentVal.toString();
  }

  updateResult();
}

// ------------------------------
// Calculate Result
// ------------------------------
function calculateResult() {
  if (!state.currentExpression) return;

  try {
   
    const display = document.getElementById("result");
    let normalizedExpression = normalizeExpression(state.currentExpression);

    // 🧠 Replace "ans" with last result automatically
    normalizedExpression = normalizedExpression.replace(
      /\bans\b/gi,
      state.LAST_RESULT,
    );

    // Calculate result
    let result = eval(normalizedExpression);
    console.log("Calculated result for expression:", state.currentExpression, "->", result);
    // Save result for future expressions
    state.LAST_RESULT = result;

    // Display normally
    display.value = result;

    if (isNaN(result) || !isFinite(result)) {
      throw new Error();
    }

    state.currentExpression = result.toString();
    updateResult();
  } catch (e) {
    state.currentExpression = "Error";
    updateResult();
  }
}


function updateResult() {
  document.getElementById("result").value = state.currentExpression || "0";
}

module.exports = {
  toggleTheme,
  appendToResult,
  operatorToResult,
  clearResult,
  calculateResult,
  normalizeExpression,
  percentToResult,
  backspace,
  updateResult,
  state
};