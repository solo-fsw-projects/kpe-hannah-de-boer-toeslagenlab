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
        this.slideNumber = 0;
        this.slidesChangedStack = []; // Stack to track slide sequence
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
        if (typeof startSaldo !== 'number') {
            throw new Error('startSaldo must be a number');
        }
        this.originalSaldo = this.previousSaldo = startSaldo;
        this.simulation = new SaldoSimulation(startSaldo);
        this.slideNumber = 0;
        this.slidesChangedStack = [];
    }

    progressOneSlide() {
        this.slideNumber++;
        if (this.slidesChangedStack[this.slideNumber] === undefined) {
            this.slidesChangedStack[this.slideNumber] = false;
        }
    }

    previousSlide() {
        // because slideNumber will first be increased by one before checking the state, we need to subtract 2 to go back to the previous slide
        this.slideNumber = this.slideNumber - 2;
        if (this.slideNumber < 0) {
            this.slideNumber = 0;
        }
    }

    markSlideAsChanged() {
        this.slidesChangedStack[this.slideNumber] = true;
    }

    applyToeslagSettings(naam, percentage) {
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

    setCurrentMonth(monthName) {

        let foundMonth = this.getMonth(monthName);
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

    getMonth(monthName) {
        if (typeof monthName !== 'string') {
            throw new Error('monthName must be a string');
        }
        if (!monthName) return;

        return this.months.find(month => month.name === monthName);
    }

    getCurrentSaldo() {
        return this.simulation?.getSaldo() ?? 0;
    }

    previousSlideHasDifferentSaldo() {
        // If we're not tracking any slides yet, allow previous
        if (this.slidesChangedStack.length === 0) return false;

        // If we're on the first slide, allow previous
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
        if (typeof amount !== 'number') {
            throw new Error('amount must be a number');
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
