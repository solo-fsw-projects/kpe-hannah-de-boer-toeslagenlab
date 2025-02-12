export class UIManager {
    static showLoading() {
        const loading = document.querySelector('#loading');
        if (loading) {
            loading.style.display = 'block';
        }
    }

    static hideLoading() {
        const loading = document.querySelector('#loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    static updateProgressBar(month) {
        if (!month) return;

        // Update month name
        const monthName = document.querySelector('.month-name');
        if (monthName) {
            monthName.textContent = month.name;
        }

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

        if (currentAmount === newAmount) {
            amountElement.textContent = newAmount;
            return;
        }

        const start = currentAmount;
        const end = newAmount;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = Math.round(start + (end - start) * progress);
            amountElement.textContent = current;

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
                const amount = item.getName() === toeslagNaam ? 
                    Math.round(item.getAmount() * toeslagPercentage / 100) : 
                    item.getAmount();
                return `${item.getName()} € ${amount}`;
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

        questionText.innerHTML = content;
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
