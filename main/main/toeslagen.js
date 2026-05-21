class SaldoSimulation {
  constructor(startSaldo) {
    this.saldo = startSaldo;
  }
  applyIncomes(incomes) {
    incomes.forEach((income) => {
      this.saldo += income.getAmount();
    });
  }
  applyFixedExpenses(fixedExpenses) {
    fixedExpenses.forEach((expense) => {
      this.saldo -= expense.getAmount();
    });
  }
  applyVariableExpense(expense) {
    if (expense) {
      this.saldo -= expense.getAmount();
    }
  }
  getSaldo() {
    return this.saldo;
  }
  applyCustomExpense(amount) {
    if (typeof amount === "number") {
      this.saldo -= amount;
    }
  }
}
class Month {
  constructor(name) {
    this.name = name;
    this.incomes = [];
    this.fixedExpenses = [];
    this.variableExpenses = [];
    this.variableExpenseCounter = 0;
  }
  addIncome(income) {
    this.incomes.push(income);
  }
  addFixedExpense(expense) {
    this.fixedExpenses.push(expense);
  }
  addVariableExpense(expense) {
    this.variableExpenses.push(expense);
  }
  getIncomes(toeslagNaam = "", toeslagPercentage = 100) {
    return this.incomes;
  }
  getFixedExpenses() {
    return this.fixedExpenses;
  }
  getVariableExpenses() {
    return this.variableExpenses;
  }
  getNextVariableExpense(increment = true) {
    if (this.variableExpenseCounter >= this.variableExpenses.length) {
      return null;
    }
    const expense = this.variableExpenses[this.variableExpenseCounter];
    if (increment) {
      this.variableExpenseCounter++;
    }
    return expense;
  }
}
class Income {
  constructor(name, amount) {
    this.name = name;
    this.amount = parseInt(amount);
    this.percentage = 100;
  }
  getOriginalAmount() {
    return this.amount;
  }
  getAmount() {
    return Math.round(this.amount * (this.percentage / 100));
  }
  getName() {
    return this.name;
  }
  getPercentage() {
    return this.percentage;
  }
  setPercentage(percentage) {
    this.percentage = percentage;
  }
}
class Expense {
  constructor(name, description, amount) {
    this.name = name;
    this.description = description;
    this.amount = parseInt(amount);
  }
  getAmount() {
    return this.amount;
  }
  getName() {
    return this.name;
  }
  getDescription() {
    return this.description;
  }
}
class CSVService {
  static async fetchCSV(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  }
  static convertCSVToObjects(csvData) {
    const lines = csvData.split("\n");
    if (lines.length < 2) {
      throw new Error("CSV file is empty or malformed");
    }
    const months = /* @__PURE__ */ new Map();
    let currentMonth = null;
    lines.slice(1).forEach((line) => {
      if (!line.trim()) return;
      const fields = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((field) => field.trim().replace(/["]/g, ""));
      const monthName = fields[0];
      const income = fields[1];
      const incomeAmount = fields[2];
      const fixedExpense = fields[3];
      const fixedAmount = fields[4];
      const variableExpense = fields[5];
      const variableDescription = fields[6];
      const variableAmount = fields[7];
      if (monthName) {
        currentMonth = new Month(monthName);
        months.set(monthName, currentMonth);
      }
      if (!currentMonth) return;
      if (income && incomeAmount) {
        currentMonth.addIncome(new Income(income, parseInt(incomeAmount)));
      }
      if (fixedExpense && fixedAmount) {
        currentMonth.addFixedExpense(new Expense(fixedExpense, "", parseInt(fixedAmount)));
      }
      if (variableExpense && variableAmount) {
        currentMonth.addVariableExpense(new Expense(variableExpense, variableDescription, parseInt(variableAmount)));
      }
    });
    return Array.from(months.values());
  }
}
class UIManager {
  static updateProgressBar(months, currentMonth) {
    if (!currentMonth || !(months == null ? void 0 : months.length) || !Array.isArray(months) || !months.includes(currentMonth)) {
      console.error("UIManager.updateProgressBar: invalid parameters", { currentMonth, months });
      return;
    }
    const monthName = document.querySelector(".month-name");
    const circleContainer = document.querySelector(".circle-container");
    if (!monthName || !circleContainer) {
      console.error("UIManager.updateProgressBar: .month-name or .circle-container not found in DOM");
      return;
    }
    if (monthName) {
      monthName.textContent = currentMonth.name;
    }
    const percentage = months.indexOf(currentMonth) / (months.length - 1) * 65;
    circleContainer.style.left = `calc(${percentage}% - 18px)`;
  }
  static updateAmount(currentAmount, newAmount) {
    const amountElement = document.querySelector(".amount");
    if (!amountElement) return;
    if (currentAmount === newAmount) {
      amountElement.textContent = String(newAmount);
      return;
    }
    const start = parseInt(currentAmount) || 0;
    const end = parseInt(newAmount) || 0;
    const duration = 1e3;
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(start + (end - start) * progress);
      amountElement.textContent = String(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }
  static replaceQuestionTextVariables(currentMonth, toeslagNaam, toeslagPercentage) {
    const questionText = document.querySelector(".QuestionText");
    if (!questionText || !currentMonth) return;
    const variables = {
      "income": () => this.replaceByList(currentMonth.getIncomes(), (item) => {
        return `${item.getName()} € ${item.getAmount()}`;
      }),
      "fixed_expenses": () => this.replaceByList(
        currentMonth.getFixedExpenses(),
        (item) => `${item.getName()} € ${item.getAmount()}`
      ),
      "variable_expense_name": () => {
        const expense = currentMonth.getNextVariableExpense(false);
        return expense ? expense.getName() : "{{ERROR}}";
      },
      "variable_expense_description": () => {
        const expense = currentMonth.getNextVariableExpense(false);
        return expense ? expense.getDescription() : "{{ERROR}}";
      },
      "variable_expense_amount": () => {
        const expense = currentMonth.getNextVariableExpense(false);
        return expense ? expense.getAmount() : "{{ERROR}}";
      }
    };
    let content = questionText.innerHTML;
    Object.entries(variables).forEach(([key, getter]) => {
      const placeholder = `{{${key}}}`;
      content = content.replace(placeholder, getter());
    });
    if (content !== questionText.innerHTML) {
      questionText.innerHTML = content;
      console.log("Variables were replaced in question text.");
    }
  }
  static replaceByList(items, formatter) {
    return `<ul>${items.map(
      (item) => `<li>${formatter(item)}</li>`
    ).join("")}</ul>`;
  }
  static togglePreviousButton(enable) {
    const previousButton = document.querySelector("#PreviousButton");
    if (previousButton) {
      previousButton.style.display = enable ? "block" : "none";
    }
  }
}
class SimulationManager {
  constructor() {
    this.simulation = null;
    this.months = null;
    this.currentMonth = null;
    this.originalSaldo = 0;
    this.previousSaldo = 0;
    this.toeslagNaam = "";
    this.toeslagPercentage = 0;
    this.slideNumber = 0;
    this.slidesChangedStack = [];
  }
  async initialize(sheetUrl) {
    if (this.months === null && sheetUrl) {
      const csvData = await CSVService.fetchCSV(sheetUrl);
      this.months = CSVService.convertCSVToObjects(csvData);
    }
  }
  isInitialized() {
    return Array.isArray(this.months) && this.months.length > 0;
  }
  isDifferentThenOriginalSaldo(saldo) {
    return this.originalSaldo !== saldo;
  }
  startNewSimulation(startSaldo) {
    if (typeof startSaldo !== "number") {
      throw new Error("startSaldo must be a number");
    }
    this.originalSaldo = this.previousSaldo = startSaldo;
    this.simulation = new SaldoSimulation(startSaldo);
    this.slideNumber = 0;
    this.slidesChangedStack = [];
  }
  progressOneSlide() {
    this.slideNumber++;
    if (this.slidesChangedStack[this.slideNumber] === void 0) {
      this.slidesChangedStack[this.slideNumber] = false;
    }
  }
  previousSlide() {
    this.slideNumber = this.slideNumber - 2;
    if (this.slideNumber < 0) {
      this.slideNumber = 0;
    }
  }
  markSlideAsChanged() {
    this.slidesChangedStack[this.slideNumber] = true;
  }
  applyToeslagSettings(naam, percentage) {
    if (typeof naam !== "string") {
      throw new Error("naam must be a string");
    }
    if (typeof percentage !== "number") {
      throw new Error("percentage must be a number");
    }
    this.toeslagNaam = naam;
    this.toeslagPercentage = percentage;
    this.applyToeslagPercentageToIncomes();
  }
  applyToeslagPercentageToIncomes() {
    if (!this.toeslagNaam) return;
    let applied = false;
    let foundToeslagNaam = false;
    this.months.forEach(
      (month) => month.getIncomes().forEach((income) => {
        if (income.getName() === this.toeslagNaam) {
          foundToeslagNaam = true;
          if (income.getPercentage() === this.toeslagPercentage) return;
          income.setPercentage(this.toeslagPercentage);
          applied = true;
        }
      })
    );
    if (applied) {
      console.log(`Applied ${this.toeslagPercentage}% to ${this.toeslagNaam}`);
    }
    if (!foundToeslagNaam) {
      console.error(`Could not find toeslag_naam '${this.toeslagNaam}' in sheet data`);
    }
  }
  setCurrentMonth(monthName) {
    var _a;
    let foundMonth = this.getMonth(monthName);
    if (!foundMonth) {
      console.error(`Cannot find ${monthName} in months data`);
      this.currentMonth = void 0;
      return false;
    }
    if (foundMonth.name !== ((_a = this.currentMonth) == null ? void 0 : _a.name)) {
      this.currentMonth = foundMonth;
      console.log(`Month changed to ${foundMonth.name}`);
    }
    return true;
  }
  getMonth(monthName) {
    if (typeof monthName !== "string") {
      throw new Error("monthName must be a string");
    }
    if (!monthName) return;
    return this.months.find((month) => month.name === monthName);
  }
  getCurrentSaldo() {
    var _a;
    return ((_a = this.simulation) == null ? void 0 : _a.getSaldo()) ?? 0;
  }
  previousSlideHasDifferentSaldo() {
    if (this.slidesChangedStack.length === 0) return false;
    if (this.slideNumber < 2) return false;
    return this.slidesChangedStack[this.slideNumber - 1];
  }
  getPreviousSaldo() {
    return this.previousSaldo;
  }
  updatePreviousSaldo() {
    const currentSaldo = this.getCurrentSaldo();
    this.previousSaldo = currentSaldo;
  }
  applyIncomes() {
    if (!this.currentMonth || !this.simulation) return;
    this.simulation.applyIncomes(this.currentMonth.getIncomes());
    this.markSlideAsChanged();
  }
  applyFixedExpenses() {
    if (!this.currentMonth || !this.simulation) return;
    const expenses = this.currentMonth.getFixedExpenses();
    this.simulation.applyFixedExpenses(expenses);
    this.markSlideAsChanged();
  }
  applyVariableExpense() {
    if (!this.currentMonth || !this.simulation) return;
    const expense = this.currentMonth.getNextVariableExpense(true);
    if (expense === null) return;
    this.simulation.applyVariableExpense(expense);
    this.markSlideAsChanged();
  }
  applyCustomExpense(amount) {
    if (typeof amount !== "number") {
      throw new Error("amount must be a number");
    }
    if (!this.simulation) return;
    this.simulation.applyCustomExpense(amount);
    this.markSlideAsChanged();
  }
  getVariableExpense() {
    if (!this.currentMonth || !this.simulation) return;
    return this.currentMonth.getNextVariableExpense(false);
  }
}
(function() {
  console.log("toeslagen.js is loaded.");
  const simulationManager = new SimulationManager();
  async function runOnNewSlide(sheetUrl, enablePreviousButton, startSaldo, currentMonthName, currentToeslagNaam, currentToeslagPercentage) {
    try {
      const parsedEnablePrevious = enablePreviousButton === "1";
      const parsedStartSaldo = Number(startSaldo) || 0;
      const parsedMonthName = String(currentMonthName || "");
      const parsedToeslagNaam = String(currentToeslagNaam || "");
      const parsedToeslagPercentage = Number(currentToeslagPercentage) || 0;
      UIManager.togglePreviousButton(parsedEnablePrevious);
      if (!sheetUrl) return;
      if (!simulationManager.isInitialized()) {
        await simulationManager.initialize(sheetUrl);
        console.log("Simulation data initialized");
      }
      if (!parsedMonthName || parsedStartSaldo === 0) return;
      if (isNewSimulation(parsedStartSaldo)) {
        simulationManager.startNewSimulation(parsedStartSaldo);
        console.log("Simulation started with saldo " + parsedStartSaldo);
      }
      if (!simulationManager.setCurrentMonth(parsedMonthName)) {
        return;
      }
      simulationManager.progressOneSlide();
      if (simulationManager.previousSlideHasDifferentSaldo()) {
        console.log("Saldo change from " + simulationManager.getPreviousSaldo() + " to " + simulationManager.getCurrentSaldo());
      }
      if (parsedToeslagNaam) {
        simulationManager.applyToeslagSettings(parsedToeslagNaam, parsedToeslagPercentage);
      }
      updateUI(parsedEnablePrevious);
      simulationManager.updatePreviousSaldo();
      console.log("Slide update completed successfully");
    } catch (error) {
      console.error("Error in runOnNewSlide:", error);
    }
  }
  function isNewSimulation(parsedStartSaldo) {
    return parsedStartSaldo > 0 && simulationManager.isDifferentThenOriginalSaldo(parsedStartSaldo);
  }
  function updateUI(parsedEnablePrevious) {
    if (parsedEnablePrevious) {
      UIManager.togglePreviousButton(!simulationManager.previousSlideHasDifferentSaldo());
    }
    UIManager.replaceQuestionTextVariables(
      simulationManager.currentMonth,
      simulationManager.toeslagNaam,
      simulationManager.toeslagPercentage
    );
    UIManager.updateProgressBar(simulationManager.months, simulationManager.currentMonth);
    UIManager.updateAmount(simulationManager.getPreviousSaldo(), simulationManager.getCurrentSaldo());
  }
  window.toeslagen = {
    runOnNewSlide,
    getMonths: () => {
      return simulationManager.months;
    },
    applyIncomes: () => {
      simulationManager.applyIncomes();
      console.log("Incomes (" + simulationManager.currentMonth.name + ") applied");
    },
    applyFixedExpenses: () => {
      simulationManager.applyFixedExpenses();
      console.log("Fixed expenses (" + simulationManager.currentMonth.name + ") applied");
    },
    applyVariableExpense: () => {
      simulationManager.applyVariableExpense();
      console.log("Variable expense (" + simulationManager.currentMonth.name + ") applied");
    },
    applyCustomExpense: (amount) => {
      const parsedAmount = Number(amount) || 0;
      simulationManager.applyCustomExpense(parsedAmount);
      console.log("Custom expense of " + parsedAmount + " applied");
    },
    getVariableExpense: () => {
      return simulationManager.getVariableExpense();
    },
    runOnPreviousButton: () => {
      console.log("Previous button clicked");
      simulationManager.previousSlide();
    }
  };
})();
