export class UIManager {
    static updateProgressBar(month) {
        const circles = document.querySelectorAll('.circle');
        circles.forEach((circle, index) => {
            circle.classList.remove('active');
            if (index === month.currentVariableExpense) {
                circle.classList.add('active');
            }
        });
    }

    static updateAmount(currentAmount, newAmount) {
        const amountElement = document.querySelector('.amount');
        if (!amountElement) return;

        const formatter = new Intl.NumberFormat('nl-NL', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        if (currentAmount === newAmount) {
            amountElement.textContent = formatter.format(newAmount);
            return;
        }

        const start = currentAmount;
        const end = newAmount;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = start + (end - start) * progress;
            amountElement.textContent = formatter.format(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    static replaceQuestionTextVariables(currentMonth, toeslagNaam, toeslagPercentage) {
        const questionText = document.querySelector('.QuestionText');
        if (!questionText) return;

        const variables = {
            'income': () => this.replaceByList(currentMonth.getIncomes(toeslagNaam, toeslagPercentage)),
            'fixed_expenses': () => this.replaceByList(currentMonth.getFixedExpenses()),
            'variable_expense_name': () => {
                const expense = currentMonth.getNextVariableExpense(false);
                return expense ? expense.getName() : '{{ERROR}}';
            },
            'variable_expense_description': () => {
                const expense = currentMonth.getNextVariableExpense(false);
                return expense ? expense.getDescription() : '{{ERROR}}';
            },
            'variable_expense_amount': () => {
                const expense = currentMonth.getNextVariableExpense(false);
                return expense ? expense.getAmount() : '{{ERROR}}';
            }
        };

        let content = questionText.innerHTML;
        Object.entries(variables).forEach(([key, getter]) => {
            const placeholder = `{{${key}}}`;
            content = content.replace(placeholder, getter());
        });

        questionText.innerHTML = content;
    }

    static replaceByList(items) {
        return `<ul>${items.map(item => 
            `<li>${item.getName()} &euro; ${item.getAmount()}</li>`
        ).join('')}</ul>`;
    }

    static togglePreviousButton(enable) {
        const previousButton = document.querySelector('#PreviousButton');
        if (previousButton) {
            previousButton.style.display = enable ? 'block' : 'none';
        }
    }
}
