
(function () {

    console.log('toeslagen.js is loaded.');

    let originalSaldo = 0;
    let currentSaldo = 0;
    let previousSaldo = 0;
    let simulation = null;
    let months = null;
    let currentMonth = null;
    let toeslagNaam = '';
    let toeslagPercentage = 0;

    runOnNewSlide = async function (sheetUrl, enablePreviousButton, startSaldo, currentMonthName, currentToeslagNaam, currentToeslagPercentage) {
        doPreviousButton(enablePreviousButton);

        // Initialize months if needed
        if (canMonthsBeInitialized(sheetUrl)) {
            await initMonths(sheetUrl);
        }

        if (simulationIsNotStarted(startSaldo)) {
            return;
        }

        if (isMonthsEmptyAfterInitialization()) {
            console.error('Months is not initialized because of earlier error, cannot proceed.');
        }

        if (currentToeslagNaam !== '' && toeslagNaam !== currentToeslagNaam) {
            toeslagNaam = currentToeslagNaam;
            toeslagPercentage = currentToeslagPercentage;
            applyToeslagPercentageToIncomes();
        }

        if (originalSaldo !== startSaldo) {
            // Start a new simulation when the start saldo changes
            originalSaldo = previousSaldo = currentSaldo = startSaldo;
            simulation = new SaldoSimulation(startSaldo);
            console.log('Simulation is started with saldo ' + startSaldo);
        }

        currentSaldo = simulation.getSaldo();
        currentMonth = months.find(month => month.name === currentMonthName);
        if (!currentMonth) {
            console.error(`Cannot find ${currentMonthName} in months data`);
            return;
        }

        if (currentSaldo !== previousSaldo) {
            doPreviousButton(0);
        }

        // Replace variables in the dynamic blocks
        replaceQuestionTextVariables(currentMonth);

        updateProgressBar(currentMonth);
        updateAmount(previousSaldo, currentSaldo);

        previousSaldo = currentSaldo;
        console.log('Progress bar is updated');
    }

    function doPreviousButton(enable) {
        let previousButton = document.querySelector('#PreviousButton');
        if (!previousButton) {
            return;
        }

        if (enable) {
            previousButton.style.display = 'block';
            console.log('Previous button is enabled');
        } else {
            previousButton.style.display = 'none';
            console.log('Previous button is disabled');
        }
    }

    function canMonthsBeInitialized(sheetUrl) {
        return months === null && sheetUrl.length > 0;
    }

    function isMonthsEmptyAfterInitialization() {
        return Array.isArray(months) && months.length === 0;
    }

    function simulationIsNotStarted(startSaldo) {
        return (!startSaldo || startSaldo === 0) && simulation === null;
    }

    function applyToeslagPercentageToIncomes() {
        if (toeslagNaam === '') {
            return;
        }

        let toeslagPercentageApplied = false;
        months.forEach(month => month.getIncomes().forEach(income => {
            if (income.getName() === toeslagNaam) {
                income.setPercentage(toeslagPercentage);
                toeslagPercentageApplied = true;
            }
        }));

        if (toeslagPercentageApplied) {
            console.log(`Er wordt ${toeslagPercentage} procent van ${toeslagNaam} gebruikt in de simulatie.`)
        }
        else {
            console.error(`Kan toeslag_naam '${toeslagNaam}' niet vinden in de sheet input`);
        }
    }

    function replaceQuestionTextVariables(currentMonth) {
        const questionText = document.querySelector('.QuestionText');
        const variables = [
            'income',
            'fixed_expenses',
            'variable_expense_name',
            'variable_expense_description',
            'variable_expense_amount'
        ];

        if (!questionText) {
            return;
        }
        let content = questionText.innerHTML;

        variables.forEach(variable => {
            const placeholder = `{{${variable}}}`;
            let variableExpense = currentMonth.getNextVariableExpense(false);
            switch (variable) {
                case 'income':
                    content = replaceByList(content, placeholder, currentMonth.getIncomes(toeslagNaam, toeslagPercentage));
                    break;
                case 'fixed_expenses':
                    content = replaceByList(content, placeholder, currentMonth.getFixedExpenses());
                    break;
                case 'variable_expense_name':
                    if (variableExpense === null) {
                        replacement = '{{ERROR}}';
                    } else {
                        replacement = variableExpense.getName();
                    }
                    content = content.replace(placeholder, replacement);
                    break;
                case 'variable_expense_description':
                    if (variableExpense === null) {
                        replacement = '{{ERROR}}';
                    } else {
                        replacement = variableExpense.getDescription();
                    }
                    content = content.replace(placeholder, replacement);
                    break;
                case 'variable_expense_amount':
                    if (variableExpense === null) {
                        replacement = '{{ERROR}}';
                    } else {
                        replacement = variableExpense.getAmount();
                    }
                    content = content.replace(placeholder, replacement);
                    break;
            }
        });

        questionText.innerHTML = content;
    }

    function replaceByList(content, placeholder, list) {
        const listHtml = `<ul>${list.map(item => `<li>${item.name} &euro; ${item.getAmount()}</li>`).join('')}</ul>`;

        return content.replace(placeholder, listHtml);
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

        /**
         * @return {Income[]}
         */
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
            this.percentage = 100;
        }

        getOriginalAmount() {
            return this.amount;
        }

        getAmount() {
            return Math.round(this.amount * (this.percentage / 100));
        }

        getName() {
            return this.name;
        }

        setPercentage(percentage) {
            this.percentage = percentage;
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

        /**
         * @param {Income[]} incomes
         */
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
        if (!Array.isArray(csvData) || csvData.length < 2) {
            return [];
        }

        const [headers, ...rows] = csvData;
        if (!Array.isArray(headers) || headers.length < 8) {
            return [];
        }

        const months = [];
        let currentMonth = null;

        rows.forEach(row => {
            if (!Array.isArray(row) || row.length < 8) {
                return;
            }

            const [month, incomeSource, incomeAmount, fixedExpense, fixedAmount, variableExpense, variableDescription, variableAmount] = row;

            if (month) {
                currentMonth = new Month(month);
                months.push(currentMonth);
            }

            if (!currentMonth) {
                console.error('No initial month found');
                return;
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

        const percentage = (months.indexOf(month) / (months.length - 1)) * 65;
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

    async function initMonths(sheetUrl) {
        const content = await fetchURLContent(sheetUrl);
        if (content === null) {
            months = [];
            return;
        }
        let csvData = fetchCSV(content);
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
            console.error('Error fetching the sheet contents, please check the URL:', error);
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

    getNextVariableExpense = function () {
        return currentMonth.getNextVariableExpense(false);
    }

    window.toeslagen = {
        runOnNewSlide,
        applyIncomes,
        applyFixedExpenses,
        applyVariableExpense,
        getMonths,
        getNextVariableExpense
    };

})();
