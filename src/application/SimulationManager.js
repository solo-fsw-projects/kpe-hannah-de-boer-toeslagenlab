import { SaldoSimulation } from '../domain/SaldoSimulation.js';
import { CSVService } from '../infrastructure/CSVService.js';
import { UIManager } from '../presentation/UIManager.js';

export class SimulationManager {
    constructor() {
        this.simulation = null;
        this.months = null;
        this.currentMonth = null;
        this.originalSaldo = 0;
        this.previousSaldo = 0;
        this.toeslagNaam = '';
        this.toeslagPercentage = 0;
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
        if (typeof startSaldo !== 'number') {
            throw new Error('startSaldo must be a number');
        }
        this.originalSaldo = this.previousSaldo = startSaldo;
        this.simulation = new SaldoSimulation(startSaldo);
    }

    updateToeslagSettings(naam, percentage) {
        if (typeof naam !== 'string') {
            throw new Error('naam must be a string');
        }
        if (typeof percentage !== 'number') {
            throw new Error('percentage must be a number');
        }
        this.toeslagNaam = naam;
        this.toeslagPercentage = percentage;
        this.applyToeslagPercentageToIncomes();
    }

    applyToeslagPercentageToIncomes() {
        if (!this.toeslagNaam) return;

        let applied = false;
        let foundToeslagNaam = false;

        this.months.forEach(month => 
            month.getIncomes().forEach(income => {
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

    updateCurrentMonth(monthName) {
        if (typeof monthName !== 'string') {
            throw new Error('monthName must be a string');
        }
        if (!monthName) return;

        let foundMonth = this.months.find(month => month.name === monthName);
        if (!foundMonth) {
            console.error(`Cannot find ${monthName} in months data`);
            this.currentMonth = undefined;
            return false;
        }
        if (foundMonth.name !== this.currentMonth?.name) {
            this.currentMonth = foundMonth;
            console.log(`Month changed to ${foundMonth.name}`);
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
        this.previousSaldo = this.getCurrentSaldo();
    }

    applyIncomes() {
        if (!this.currentMonth || !this.simulation) return;
        
        this.simulation.applyIncomes(this.currentMonth.getIncomes());
    }

    applyFixedExpenses() {
        if (!this.currentMonth || !this.simulation) return;
        
        const expenses = this.currentMonth.getFixedExpenses();
        this.simulation.applyFixedExpenses(expenses);
    }

    applyVariableExpense() {
        if (!this.currentMonth || !this.simulation) return;
        
        const expense = this.currentMonth.getNextVariableExpense(true);
        if (expense === null) return;
        this.simulation.applyVariableExpense(expense);
    }

    applyCustomExpense(amount) {
        if (typeof amount !== 'number') {
            throw new Error('amount must be a number');
        }
        if (!this.simulation) return;
        this.simulation.applyCustomExpense(amount);
    }

    getVariableExpense() {
        if (!this.currentMonth || !this.simulation) return;
        
        return this.currentMonth.getNextVariableExpense(false);
    }
}
