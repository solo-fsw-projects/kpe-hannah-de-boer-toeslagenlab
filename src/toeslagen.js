import { SimulationManager } from './application/SimulationManager.js';
import { UIManager } from './presentation/UIManager.js';

(function () {
    console.log('toeslagen.js is loaded.');
    
    const simulationManager = new SimulationManager();

    async function runOnNewSlide(sheetUrl, enablePreviousButton, startSaldo, currentMonthName, currentToeslagNaam, currentToeslagPercentage) {
        try {
            // Parse input parameters
            const parsedEnablePrevious = Boolean(enablePreviousButton);
            const parsedStartSaldo = Number(startSaldo) || 0;
            const parsedMonthName = String(currentMonthName || '');
            const parsedToeslagNaam = String(currentToeslagNaam || '');
            const parsedToeslagPercentage = Number(currentToeslagPercentage) || 0;

            UIManager.togglePreviousButton(parsedEnablePrevious);
            UIManager.showLoading();

            if (!simulationManager.isInitialized()) {
                // Initialize simulation if needed
                if (!sheetUrl) return;
                await simulationManager.initialize(sheetUrl);
                if (!simulationManager.isInitialized()) {
                    console.error('Simulation not initialized - missing or invalid data');
                    UIManager.hideLoading();
                }
                return;
            }

            // Start or update simulation
            if (parsedStartSaldo > 0 && simulationManager.originalSaldo !== parsedStartSaldo) {
                simulationManager.startNewSimulation(parsedStartSaldo);
                console.log('Simulation started with saldo ' + parsedStartSaldo);
            }

            // Update toeslag settings if changed
            if (parsedToeslagNaam) {
                simulationManager.updateToeslagSettings(parsedToeslagNaam, parsedToeslagPercentage);
            }

            // Update current month
            if (!simulationManager.updateCurrentMonth(parsedMonthName)) {
                UIManager.hideLoading();
                return;
            }

            simulationManager.progressOneSlide();

            // Update UI
            if (simulationManager.previousSlideChangesSaldo()) {
                console.log('Saldo change from ' + simulationManager.getPreviousSaldo() + ' to ' + simulationManager.getCurrentSaldo());
            }
            UIManager.togglePreviousButton(!simulationManager.previousSlideChangesSaldo() && parsedEnablePrevious);
        

            UIManager.replaceQuestionTextVariables(
                simulationManager.currentMonth,
                simulationManager.toeslagNaam,
                simulationManager.toeslagPercentage
            );

            UIManager.updateProgressBar(simulationManager.months, simulationManager.currentMonth);
            UIManager.updateAmount(simulationManager.getPreviousSaldo(), simulationManager.getCurrentSaldo());

            simulationManager.updatePreviousSaldo();
            console.log('Slide update completed successfully');
        } catch (error) {
            console.error('Error in runOnNewSlide:', error);
            UIManager.hideLoading();
        }
    }

    window.toeslagen = {
        runOnNewSlide,
        getMonths: () => {
            return simulationManager.months
        },
        applyIncomes: () => {
            simulationManager.applyIncomes();
            console.log('Incomes (' + simulationManager.currentMonth.name + ') applied');
        },
        applyFixedExpenses: () => {
            simulationManager.applyFixedExpenses();
            console.log('Fixed expenses (' + simulationManager.currentMonth.name + ') applied');
        },
        applyVariableExpense: () => {
            simulationManager.applyVariableExpense();
            console.log('Variable expense (' + simulationManager.currentMonth.name + ') applied');
        },
        applyCustomExpense: (amount) => {
            const parsedAmount = Number(amount) || 0;
            simulationManager.applyCustomExpense(parsedAmount);
            console.log('Custom expense of ' + parsedAmount + ' applied');
        },
        getVariableExpense: () => {
            return simulationManager.getVariableExpense();
        },
        runOnPreviousButton: () => {
            simulationManager.previousSlide();
        }
    };

})();
