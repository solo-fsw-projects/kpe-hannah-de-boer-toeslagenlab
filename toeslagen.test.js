
const nextButton = document.getElementById("next-button");
const description = document.getElementById("description");

nextButton.addEventListener("click", () =>
{
    if (currentMonthIndex >= totalMonths) {
        description.textContent = "Simulation done.";
        return;
    }
    month = months[currentMonthIndex];

    total = simulation.getTotal();
    updateProgressBar();
    updateAmount(previousTotal, total);

    switch (monthState) {
        case 1:
            simulation.applyIncomes(month.getIncomes());
            description.innerHTML = "Je ontvangt inkomen van:<br><br>" + month.getIncomes().map(item => `${item.getName()}: ${item.getAmount()}`).join('<br>') + '.';
            monthState++;
            break;
        case 2:
            simulation.applyFixedExpenses(month.getFixedExpenses());
            description.innerHTML = "Je vaste lasten moet je betalen:<br><br>" + month.getFixedExpenses().map(item => `${item.getName()}: ${item.getAmount()}`).join('<br>') + '.';
            monthState++;
            break;
        case 3:
            let variableExpense = month.getNextVariableExpense();
            if (variableExpense === null) {
                currentMonthIndex++;
                monthState = 1;
                description.textContent = "Geen variabele uitgaven meer deze maand.";
            } else {
                simulation.applyExpense(variableExpense);
                description.textContent = `${variableExpense.getDescription() ?? variableExpense.getName()} met een bedrag van ${variableExpense.getAmount()} euro.`;
            }
            break;
        case 4:
            console.log('monthState reached 4 not possible!');
    }

    previousTotal = total;
});

