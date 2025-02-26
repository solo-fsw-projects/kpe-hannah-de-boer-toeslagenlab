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

            const currentSaldo = simulationManager.getCurrentSaldo();
            const previousSaldo = simulationManager.getPreviousSaldo();

            // Update UI
            if (currentSaldo !== previousSaldo) {
                console.log('Saldo change from ' + previousSaldo + ' to ' + currentSaldo)
                UIManager.togglePreviousButton(false);
            }

            UIManager.replaceQuestionTextVariables(
                simulationManager.currentMonth,
                simulationManager.toeslagNaam,
                simulationManager.toeslagPercentage
            );

            UIManager.updateProgressBar(simulationManager.months, simulationManager.currentMonth);
            UIManager.updateAmount(previousSaldo, currentSaldo);

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
        },
        applyFixedExpenses: () => {
            simulationManager.applyFixedExpenses();
        },
        applyVariableExpense: () => {
            simulationManager.applyVariableExpense();
        },
        applyCustomExpense: (amount) => {
            const parsedAmount = Number(amount) || 0;
            simulationManager.applyCustomExpense(parsedAmount);
        },
        getVariableExpense: () => {
            return simulationManager.getVariableExpense();
        }
    };

})();
