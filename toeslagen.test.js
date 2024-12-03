
const nextButton = document.getElementById("next-button");
const description = document.getElementById("description");

let monthState = 1;
let currentMonthIndex = 0;

nextButton.addEventListener("click", () =>
{
    months = window.toeslagen.getMonths();
    if (months === null) {
        window.toeslagen.runAfterNextButton();
        console.log("first time load months");
        return;
    }
    month = months[currentMonthIndex];
    if (!month) {
        console.log('Simulation is done.');
        return;
    }
    window.toeslagen.runAfterNextButton(0, 526, month.name);

    switch (monthState) {
        case 1:
            window.toeslagen.applyIncomes(month.getIncomes());
            description.innerHTML = "Je ontvangt inkomen van:<br><br>" + month.getIncomes().map(item => `${item.getName()}: ${item.getAmount()}`).join('<br>') + '.';
            monthState++;
            break;
        case 2:
            window.toeslagen.applyFixedExpenses(month.getFixedExpenses());
            description.innerHTML = "Je vaste lasten moet je betalen:<br><br>" + month.getFixedExpenses().map(item => `${item.getName()}: ${item.getAmount()}`).join('<br>') + '.';
            monthState++;
            break;
        case 3:
            let variableExpense = month.getNextVariableExpense(false);
            if (variableExpense === null) {
                currentMonthIndex++;
                monthState = 1;
                description.textContent = "Geen variabele uitgaven meer deze maand.";
            } else {
                window.toeslagen.applyVariableExpense();
                description.textContent = `${variableExpense.getDescription() ?? variableExpense.getName()} met een bedrag van ${variableExpense.getAmount()} euro.`;
            }
            break;
        case 4:
            console.log('monthState reached 4 not possible!');
    }
});

