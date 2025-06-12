export class UIManager {
    static updateProgressBar(months, currentMonth) {
        if (!currentMonth || !months?.length || !Array.isArray(months) || !months.includes(currentMonth)) {
            console.error('UIManager.updateProgressBar: invalid parameters', { currentMonth, months });
            return;
        }

        // Update month name
        const monthName = document.querySelector('.month-name');
        const circleContainer = document.querySelector(".circle-container");
        if (!monthName || !circleContainer) {
            console.error('UIManager.updateProgressBar: .month-name or .circle-container not found in DOM');
            return;
        }

        if (monthName) {
            monthName.textContent = currentMonth.name;
        }

        const percentage = (months.indexOf(currentMonth) / (months.length - 1)) * 65;

        circleContainer.style.left = `calc(${percentage}% - 18px)`;
    }

    static updateAmount(currentAmount, newAmount) {
        const amountElement = document.querySelector('.amount');
        if (!amountElement) return;

        if (currentAmount === newAmount) {
            amountElement.textContent = String(newAmount);
            return;
        }

        const start = parseInt(currentAmount) || 0;
        const end = parseInt(newAmount) || 0;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = Math.round(start + (end - start) * progress);
            amountElement.textContent = String(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    static replaceQuestionTextVariables(currentMonth, toeslagNaam, toeslagPercentage) {
        const questionText = document.querySelector('.QuestionText');
        if (!questionText || !currentMonth) return;

        const variables = {
            'income': () => this.replaceByList(currentMonth.getIncomes(), item => {
                return `${item.getName()} € ${item.getAmount()}`;
            }),
            'fixed_expenses': () => this.replaceByList(currentMonth.getFixedExpenses(), 
                item => `${item.getName()} € ${item.getAmount()}`
            ),
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
        if (content !== questionText.innerHTML) {
            questionText.innerHTML = content;
            console.log('Variables were replaced in question text.');
        }
    }

    static replaceByList(items, formatter) {
        return `<ul>${items.map(item => 
            `<li>${formatter(item)}</li>`
        ).join('')}</ul>`;
    }

    static togglePreviousButton(enable) {
        const previousButton = document.querySelector('#PreviousButton');
        if (previousButton) {
            previousButton.style.display = enable ? 'block' : 'none';
        }
    }
}
