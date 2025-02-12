
import { SimulationManager } from './application/SimulationManager.js';
import { UIManager } from './presentation/UIManager.js';

(function () {
    console.log('toeslagen.js is loaded.');
    
    const simulationManager = new SimulationManager();

    async function runOnNewSlide(sheetUrl, enablePreviousButton, startSaldo, currentMonthName, currentToeslagNaam, currentToeslagPercentage) {
        UIManager.togglePreviousButton(enablePreviousButton);
        UIManager.showLoading();

        try {

            if (!simulationManager.isInitialized()) {
                // Initialize simulation if needed
                await simulationManager.initialize(sheetUrl);
                if (!simulationManager.isInitialized()) {
                    console.error('Simulation not initialized - missing or invalid data');
                    UIManager.hideLoading();
                }
                return;
            }

            // Start or update simulation
            if (startSaldo > 0 && simulationManager.originalSaldo !== startSaldo) {
                simulationManager.startNewSimulation(startSaldo);
            }

            // Update toeslag settings if changed
            if (currentToeslagNaam) {
                simulationManager.updateToeslagSettings(currentToeslagNaam, currentToeslagPercentage);
            }

            // Update current month
            if (!simulationManager.updateCurrentMonth(currentMonthName)) {
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

            UIManager.updateProgressBar(simulationManager.currentMonth);
            UIManager.updateAmount(previousSaldo, currentSaldo);

            simulationManager.updatePreviousSaldo();
            console.log('Slide update completed successfully');
        } catch (error) {
            console.error('Error in runOnNewSlide:', error);
        } finally {
            UIManager.hideLoading();
        }
    }

    window.toeslagen = {
        runOnNewSlide,
        getMonths: () => simulationManager.months,
        applyIncomes: () => {
            simulationManager.applyIncomes();
        },
        applyFixedExpenses: () => {
            simulationManager.applyFixedExpenses();
        },
        applyVariableExpense: () => {
            simulationManager.applyVariableExpense(false);
        },
        getNextVariableExpense: () => {
            simulationManager.applyVariableExpense(true);
        }
    };

})();
