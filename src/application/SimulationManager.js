import { SaldoSimulation } from '../domain/SaldoSimulation.js';
import { CSVService } from '../infrastructure/CSVService.js';
import { UIManager } from '../presentation/UIManager.js';

export class SimulationManager {
    constructor() {
        this.simulation = null;
        this.months = null;
        this.currentMonth = null;
        this.originalSaldo = 0;
        this.currentSaldo = 0;
        this.previousSaldo = 0;
        this.toeslagNaam = '';
        this.toeslagPercentage = 0;
        this.currentVariableExpenseIndex = 0;
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

    startNewSimulation(startSaldo) {
        this.originalSaldo = this.previousSaldo = this.currentSaldo = startSaldo;
        this.simulation = new SaldoSimulation(startSaldo);
        console.log('Simulation started with saldo ' + startSaldo);
    }

    updateToeslagSettings(naam, percentage) {
        if (naam === this.toeslagNaam) return;
        
        this.toeslagNaam = naam;
        this.toeslagPercentage = percentage;
        this.applyToeslagPercentageToIncomes();
    }

    applyToeslagPercentageToIncomes() {
        if (!this.toeslagNaam) return;

        let applied = false;
        this.months.forEach(month => 
            month.getIncomes().forEach(income => {
                if (income.getName() === this.toeslagNaam) {
                    income.setPercentage(this.toeslagPercentage);
                    applied = true;
                }
            })
        );

        if (applied) {
            console.log(`Applied ${this.toeslagPercentage}% to ${this.toeslagNaam}`);
        } else {
            console.error(`Could not find toeslag_naam '${this.toeslagNaam}' in sheet data`);
        }
    }

    updateCurrentMonth(monthName) {
        this.currentMonth = this.months.find(month => month.name === monthName);
        if (!this.currentMonth) {
            console.error(`Cannot find ${monthName} in months data`);
            return false;
        }
        return true;
    }

    getCurrentSaldo() {
        return this.simulation?.getSaldo() ?? 0;
    }

    getPreviousSaldo() {
        return this.previousSaldo;
    }

    updatePreviousSaldo() {
        this.previousSaldo = this.currentSaldo;
    }

    async applyIncomes() {
        if (!this.currentMonth || !this.simulation) return;
        
        const incomes = this.currentMonth.getIncomes();
        const adjustedIncomes = incomes.map(income => ({
            getAmount: () => income.getName() === this.toeslagNaam ?
                Math.round(income.getAmount() * this.toeslagPercentage / 100) :
                income.getAmount()
        }));
        this.simulation.applyIncomes(adjustedIncomes);
        this.currentSaldo = this.simulation.getSaldo();
    }

    async applyFixedExpenses() {
        if (!this.currentMonth || !this.simulation) return;
        
        const expenses = this.currentMonth.getFixedExpenses();
        this.simulation.applyFixedExpenses(expenses);
        this.currentSaldo = this.simulation.getSaldo();
    }

    async applyVariableExpense() {
        if (!this.currentMonth || !this.simulation) return;
        
        const expense = this.currentMonth.getNextVariableExpense(true);
        this.simulation.applyVariableExpense(expense);
        if (expense) {
            this.currentVariableExpenseIndex++;
        }
        this.currentSaldo = this.simulation.getSaldo();
    }
}
