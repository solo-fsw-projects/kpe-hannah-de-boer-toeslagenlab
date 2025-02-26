
const nextButton = document.getElementById("next-button");

let monthState = 1;
let currentMonthIndex = 0;
// https://docs.google.com/spreadsheets/d/1x8ek8aaOjty0i4IEAOlMYD4EwlBQpfzPmWUC8YuxsT0/edit?gid=1011705160#gid=1011705160
let sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhHwzTIG10KlxZ5stSQ1vuBsVbz9rSk-s4aqaSxNhOcQ4ERUynXJxCk7S4RKJ7u_PaF8XH4gv7pI8e/pub?gid=1011705160&single=true&output=csv";

nextButton.addEventListener("click", () =>
{
    months = window.toeslagen.getMonths();
    if (months === null) {
        window.toeslagen.runOnNewSlide(sheetUrl, 1, 0, 'oktober 2024', '', 100);
        console.log("first time load months");
        return;
    }
    month = months[currentMonthIndex];
    if (!month) {
        console.log('Simulation is done.');
        return;
    }

    let header = document.querySelector(".header");
    document.querySelector(".progress-bar").remove();
    let progressBar = document.createElement('div');
    progressBar.innerHTML = `
        <div class="progress-bar simulation-start">
            <div class="line"></div>
            <div class="circle-container">
                <div class="circle"></div>
                <div class="month-name"></div>
            </div>
            <div class="saldo">
                <div class="pinpas"><img src="pinpas.png"/></div>
                <div class="amount-container">
                    Je saldo:<br/>
                    &euro; <div class="amount"></div>
                </div>
            </div>
        </div>
`;
    header.appendChild(progressBar);

    let questionText = document.querySelector('.QuestionText');

    switch (monthState) {
        case 1:
            questionText.innerHTML = "Je ontvangt inkomen van:<br>{{income}}";
            break;
        case 2:
            questionText.innerHTML = "Je vaste lasten moet je betalen:<br>{{fixed_expenses}}";
            if (currentMonthIndex === 2) {
                questionText.innerHTML += "<br>Extra last: 666";
            }
            break;
        case 3:
            let variableExpense = window.toeslagen.getVariableExpense();
            if (variableExpense === null) {
                questionText.textContent = "Geen variabele uitgaven meer deze maand.";
            } else {
                questionText.textContent = `{{variable_expense_description}} met een bedrag van {{variable_expense_amount}} euro.`;
            }
            break;
        case 4:
            console.log('monthState reached 4 not possible!');
    }

    let startSaldo;
    let toeslagPercentage;
    if (currentMonthIndex === 2) {
        startSaldo = 10000;
        toeslagPercentage = 50;
    } else {
        startSaldo = 526;
        toeslagPercentage = 10;
    }

    window.toeslagen.runOnNewSlide(sheetUrl, 1, startSaldo, month.name, 'Huurtoeslag', 10);

    if (currentMonthIndex === 2) {
        window.toeslagen.applyCustomExpense(666);
    }
    
    switch (monthState) {
        case 1:
            window.toeslagen.applyIncomes();
            monthState++;
            break;
        case 2:
            window.toeslagen.applyFixedExpenses();
            monthState++;
            break;
        case 3:
            let variableExpense = window.toeslagen.getVariableExpense();
            if (variableExpense === null) {
                currentMonthIndex++;
                monthState = 1;
            } else {
                window.toeslagen.applyVariableExpense();
            }
            break;
        case 4:
            console.log('monthState reached 4 not possible!');
    }

});

