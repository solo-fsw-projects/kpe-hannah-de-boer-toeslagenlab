
const nextButton = document.getElementById("next-button");

let monthState = 1;
let currentMonthIndex = 0;

nextButton.addEventListener("click", () =>
{
    months = window.toeslagen.getMonths();
    if (months === null) {
        window.toeslagen.runOnNewSlide();
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
            break;
        case 3:
            let variableExpense = window.toeslagen.getNextVariableExpense(false);
            if (variableExpense === null) {
                questionText.textContent = "Geen variabele uitgaven meer deze maand.";
            } else {
                questionText.textContent = `{{variable_expense_description}} met een bedrag van {{variable_expense_amount}} euro.`;
            }
            break;
        case 4:
            console.log('monthState reached 4 not possible!');
    }

    window.toeslagen.runOnNewSlide(Math.random() < 0.5 ? 0 : 1, 526, month.name);

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
            let variableExpense = window.toeslagen.getNextVariableExpense(false);
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

