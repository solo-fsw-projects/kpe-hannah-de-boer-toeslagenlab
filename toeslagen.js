

function initHeader(previousTotal, currentTotal, currentMonth, csvText) {

}

let total = 526;
let previousTotal = total;
let monthState = 1;
let simulation = null;
let month = null;
let months = null;
let totalMonths = null;
let currentMonthIndex = 0;

function initSimulation() {
    simulation = new Simulation(total);
    totalMonths = months.length;
    month = months[currentMonthIndex];

    updateProgressBar();
    updateAmount(total, total);
    progressBar.style.display = 'flex';
    nextButton.disabled = false;
}


function storeEmbeddedData(key, value) {
    Qualtrics.SurveyEngine.setEmbeddedData(key, JSON.stringify(value));
}

// Classes for managing data
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

    getNextVariableExpense() {
        if (this.currentVariableExpense >= this.variableExpenses.length) {
            return null;
        }
        let currentVariableExpense = this.variableExpenses[this.currentVariableExpense];
        this.currentVariableExpense++;

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

class Simulation {
    constructor(startTotal) {
        this.total = startTotal;
        this.previousTotal = startTotal;
    }

    applyIncomes(incomes) {
        incomes.forEach(income => {
            this.total += income.getAmount();
        });
    }

    applyFixedExpenses(fixedExpenses) {
        fixedExpenses.forEach(expense => {
            this.total -= expense.getAmount();
        });
    }

    applyExpense(expense) {
        this.total -= expense.getAmount();
    }

    getTotal() {
        return this.total;
    }

    getPreviousTotal() {
        return this.previousTotal;
    }

    hasChangedTotal() {
        return this.total !== this.previousTotal;
    }

    savePreviousTotal() {
        this.previousTotal = this.total;
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

const csvText = `month,income,amount,fixed expenses,amount,expense,description,amount
september 2023,Salaris,3050,Hypotheek,1395,boodschappen,Je moet boodschappen betalen,356
,,,Energie en water,288,,,
,,,Verzekeringen,220,,,
,,,"Abonnement voor internet, TV en telefoon betalen",87,,,
oktober 2023,Salaris,3050,Kinderopvang,1040,kleding,Je koopt kleding,144
,Kinderopvangtoeslag,770,Hypotheek,1395,,,
,,,Energie en water,288,,,
,,,Verzekeringen,220,,,
,,,"Abonnement voor internet, TV en telefoon betalen",87,,,
november 2023,Salaris,3050,Kinderopvang,1040,de boodschappen,Je moet boodschappen betalen,354
,Kinderopvangtoeslag,770,Hypotheek,1395,het dagje pretpark,Jullie gaan een dagje naar een pretpark,142
,,,Energie en water,288,,,
,,,Verzekeringen,220,,,
,,,"Abonnement voor internet, TV en telefoon betalen",87,,,`;

let csvData = '';
(async () => {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS92k3uxW_oUM0QMdz55LwCihJL8I9LeAsN_N7CiUdILqSoxp33-wenoJdHzQjFd0KXoA8HWvcwC71S/pub?gid=1011705160&single=true&output=csv'; // Replace with your URL
    csvData = fetchCSV(await fetchURLContent(url));
    //const csvData = fetchCSV(csvText);
    months = convertCSVToObjects(csvData);
    if (months.lenght === 0) {
        console.error('no months parsed');
    }
    initSimulation();
})();

const progressBar = document.querySelector(".progress-bar");

// Set up the progress bar
function updateProgressBar() {
    const circleContainer = document.querySelector(".circle-container");

    const percentage = (months.indexOf(month) / (totalMonths - 1)) * 50;
    const monthName = progressBar.querySelector(".month-name");

    // Position the circle
    circleContainer.style.left = `calc(${percentage}% - 50px)`; // Center the circle
    monthName.textContent = month.name;
}

// Animate the amount
function updateAmount(currentAmount, newAmount) {
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

async function fetchURLContent(url) {
    try {
        const response = await fetch(url); // Send GET request
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.text(); // Read response as plain text
    } catch (error) {
        console.error('Error fetching the URL:', error);
        return null;
    }
}

