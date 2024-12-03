
(function () {

    console.log('toeslagen.js is loaded.');

    let startSaldo = 0;
    let currentSaldo = 0;
    let previousSaldo = 0;
    let monthState = 1;
    let simulation = null;
    let months = null;
    let currentMonth = null;

    runOnNewSlide = function (enablePreviousButton, startSaldo, currentMonthName) {
        console.log('runOnNewSlide runs');

        if (!months) {
            initMonths();
            return;
        }

        doPreviousButton(enablePreviousButton);

        if (startSaldo > 0) {
            if (currentSaldo === 0) {
                previousSaldo = currentSaldo = startSaldo;
                simulation = new SaldoSimulation(startSaldo);
                console.log('Simulation is started with saldo ' + startSaldo);
            }
            currentSaldo = simulation.getSaldo();
            currentMonth = months.find(month => month.name === currentMonthName);
            updateProgressBar(currentMonth);
            showProgressBar();
            updateAmount(previousSaldo,  currentSaldo);
            previousSaldo = currentSaldo;
            console.log('Progress bar is updated');
        }
    }

    function doPreviousButton(enable) {
        let previousButton = document.querySelector('#PreviousButton');
        if (!previousButton) {
            return;
        }

        if (enable && previousButton.style.display === '') {
            previousButton.style.display = 'block';
            console.log('Previous button is enabled');
        }
        else if (!enable && previousButton.style.display === 'flex') {
            previousButton.style.display = '';
            console.log('Previous button is disabled');
        }
    }

    function showProgressBar() {
        const progressBar = document.querySelector(".progress-bar");
        if (progressBar.style.display === '') {
            progressBar.style.display = 'flex';
            console.log('Progress bar is showing');
        }
    }

    function storeEmbeddedData(key, value) {
        Qualtrics.SurveyEngine.setEmbeddedData(key, JSON.stringify(value));
    }

    class Month {

        constructor(name) {
            this.name = name;
            this.incomes = [];
            this.fixedExpenses = [];
            this.variableExpenses = [];
            this.currentVariableExpense = 0;
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

        getIncomes() {
            return this.incomes;
        }

        getFixedExpenses() {
            return this.fixedExpenses;
        }

        getVariableExpenses() {
            return this.variableExpenses;
        }

        getNextVariableExpense(remove = true) {
            if (this.currentVariableExpense >= this.variableExpenses.length) {
                return null;
            }
            let currentVariableExpense = this.variableExpenses[this.currentVariableExpense];
            if (remove) {
                this.currentVariableExpense++;
            }

            return currentVariableExpense;
        }
    }

    class Income {
        constructor(name, amount) {
            this.name = name;
            this.amount = parseInt(amount);
        }

        getAmount() {
            return this.amount;
        }

        getName() {
            return this.name;
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

    class SaldoSimulation {
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
            this.saldo -= expense.getAmount();
        }

        getSaldo() {
            return this.saldo;
        }
    }

    function fetchCSV(csvText) {
        const rows = [];
        let currentRow = [];
        let currentField = "";
        let insideQuotes = false;

        for (let i = 0; i < csvText.length; i++) {
            const char = csvText[i];
            const nextChar = csvText[i + 1];

            if (char === '"' && insideQuotes && nextChar === '"') {
                currentField += '"';
                i++; // Skip the escaped quote
            } else if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
                currentRow.push(currentField);
                currentField = "";
            } else if ((char === '\n' || char === '\r') && !insideQuotes) {
                if (currentField || currentRow.length > 0) {
                    currentRow.push(currentField);
                    rows.push(currentRow);
                    currentRow = [];
                    currentField = "";
                }
            } else {
                currentField += char;
            }
        }

        if (currentField || currentRow.length > 0) {
            currentRow.push(currentField);
            rows.push(currentRow);
        }

        return rows;
    }

    function convertCSVToObjects(csvData) {
        const [headers, ...rows] = csvData;
        const months = [];
        let currentMonth = null;

        rows.forEach(row => {
            const [month, incomeSource, incomeAmount, fixedExpense, fixedAmount, variableExpense, variableDescription, variableAmount] = row;

            if (month) {
                currentMonth = new Month(month);
                months.push(currentMonth);
            }

            if (incomeSource && incomeAmount) {
                currentMonth.addIncome(new Income(incomeSource, incomeAmount));
            }

            if (fixedExpense && fixedAmount) {
                currentMonth.addFixedExpense(new Expense(fixedExpense, "", fixedAmount));
            }

            if (variableExpense && variableAmount) {
                currentMonth.addVariableExpense(new Expense(variableExpense, variableDescription, variableAmount));
            }
        });

        return months;
    }

    function updateProgressBar(month) {
        const progressBar = document.querySelector(".progress-bar");
        const circleContainer = document.querySelector(".circle-container");

        const percentage = (months.indexOf(month) / (months.length - 1)) * 50;
        const monthNameElement = progressBar.querySelector(".month-name");

        circleContainer.style.left = `calc(${percentage}% - 18px)`;
        monthNameElement.textContent = month.name;
    }

    function updateAmount(currentAmount, newAmount) {
        const progressBar = document.querySelector(".progress-bar");
        const amountElement = progressBar.querySelector(".amount");
        amountElement.textContent = `${newAmount}`;

        const startAmount = currentAmount;
        const difference = newAmount - startAmount;
        const steps = 60; // Number of frames
        const increment = difference / steps;

        let currentStep = 0;

        function step() {
            if (currentStep <= steps) {
                currentAmount = Math.round(startAmount + increment * currentStep);
                amountElement.textContent = `${currentAmount}`;
                currentStep++;
                requestAnimationFrame(step);
            }
        }

        step();
    }

    async function initMonths() {
        const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS92k3uxW_oUM0QMdz55LwCihJL8I9LeAsN_N7CiUdILqSoxp33-wenoJdHzQjFd0KXoA8HWvcwC71S/pub?gid=1011705160&single=true&output=csv'; // Replace with your URL
        let csvData = fetchCSV(await fetchURLContent(url));
        months = convertCSVToObjects(csvData);
        if (months.length === 0) {
            console.error('No months found in csv data');
        }
        console.log('months have been loaded');
    }

    async function fetchURLContent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Error fetching the URL:', error);
            return null;
        }
    }

    applyIncomes = function () {
        simulation.applyIncomes(currentMonth.getIncomes());
        console.log('Incomes have been applied');
    }
    applyFixedExpenses = function () {
        simulation.applyFixedExpenses(currentMonth.getFixedExpenses());
        console.log('Fixed expenses have been applied');
    }
    applyVariableExpense = function () {
        simulation.applyVariableExpense(currentMonth.getNextVariableExpense(true));
        console.log('Variable expense has been applied');
    }

    getMonths = function () {
        return months;
    }

    getIncomes = function () {
        return currentMonth.getIncomes();
    }
    getFixedExpenses = function () {
        return currentMonth.getIncomes();
    }
    getNextVariableExpense = function () {
        return currentMonth.getNextVariableExpense(false);
    }

    window.toeslagen = {
        runOnNewSlide,
        applyIncomes,
        applyFixedExpenses,
        applyVariableExpense,
        getMonths,
        getIncomes,
        getFixedExpenses,
        getNextVariableExpense
    };

})();
