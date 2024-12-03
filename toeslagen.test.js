
const nextButton = document.getElementById("next-button");
const description = document.getElementById("description");

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
    window.toeslagen.runOnNewSlide(0, 526, month.name);

    switch (monthState) {
        case 1:
            window.toeslagen.applyIncomes();
            description.innerHTML = "Je ontvangt inkomen van:<br><br>" + window.toeslagen.getIncomes().map(item => `${item.getName()}: ${item.getAmount()}`).join('<br>') + '.';
            monthState++;
            break;
        case 2:
            window.toeslagen.applyFixedExpenses();
            description.innerHTML = "Je vaste lasten moet je betalen:<br><br>" + window.toeslagen.getFixedExpenses().map(item => `${item.getName()}: ${item.getAmount()}`).join('<br>') + '.';
            monthState++;
            break;
        case 3:
            let variableExpense = window.toeslagen.getNextVariableExpense();
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

