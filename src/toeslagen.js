import { SimulationManager } from './application/SimulationManager.js';
import { UIManager } from './presentation/UIManager.js';

(function () {
    console.log('toeslagen.js is loaded.');
    
    const simulationManager = new SimulationManager();

    async function runOnNewSlide(sheetUrl, enablePreviousButton, startSaldo, currentMonthName, currentToeslagNaam, currentToeslagPercentage) {
        try {
            const parsedEnablePrevious = enablePreviousButton === '1';
            const parsedStartSaldo = Number(startSaldo) || 0;
            const parsedMonthName = String(currentMonthName || '');
            const parsedToeslagNaam = String(currentToeslagNaam || '');
            const parsedToeslagPercentage = Number(currentToeslagPercentage) || 0;

            UIManager.togglePreviousButton(parsedEnablePrevious);

            if (!sheetUrl) return;

            if (!simulationManager.isInitialized()) {
                await simulationManager.initialize(sheetUrl);
                console.log('Simulation data initialized');
            }

            if (!parsedMonthName || parsedStartSaldo === 0) return;

            if (isNewSimulation(parsedStartSaldo)) {
                simulationManager.startNewSimulation(parsedStartSaldo);
                console.log('Simulation started with saldo ' + parsedStartSaldo);
            }

            if (!simulationManager.setCurrentMonth(parsedMonthName)) {
                return;
            }

            simulationManager.progressOneSlide();
            if (simulationManager.previousSlideHasDifferentSaldo()) {
                console.log('Saldo change from ' + simulationManager.getPreviousSaldo() + ' to ' + simulationManager.getCurrentSaldo());
            }

            // Optionally applying toeslag settings
            if (parsedToeslagNaam) {
                simulationManager.applyToeslagSettings(parsedToeslagNaam, parsedToeslagPercentage);
            }

            updateUI(parsedEnablePrevious);

            simulationManager.updatePreviousSaldo();
            
            console.log('Slide update completed successfully');
        } catch (error) {
            console.error('Error in runOnNewSlide:', error);
        }
    }

    function isNewSimulation(parsedStartSaldo) {
        return parsedStartSaldo > 0 && simulationManager.isDifferentThenOriginalSaldo(parsedStartSaldo);
    }

    function updateUI(parsedEnablePrevious) {

        if (parsedEnablePrevious) {
            // Only enable previous button if the previous slide does NOT have a different saldo
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
            console.log('Previous button clicked');
            simulationManager.previousSlide();
        }
    };

})();
