export class SaldoSimulation {
    constructor(startSaldo) {
        this.saldo = startSaldo;
    }

    applyIncomes(incomes) {
        incomes.forEach(income => {
            this.saldo += income.getAmount();
        });
    }

    applyFixedExpenses(fixedExpenses) {
        fixedExpenses.forEach(expense => {
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
        if (typeof amount === 'number') {
            this.saldo -= amount;
        }
    }
}
