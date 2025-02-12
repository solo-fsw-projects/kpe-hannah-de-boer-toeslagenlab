export class Month {
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

    getIncomes(toeslagNaam = '', toeslagPercentage = 100) {
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
