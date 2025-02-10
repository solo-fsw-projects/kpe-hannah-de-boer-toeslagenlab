import { jest } from '@jest/globals';
import { UIManager } from '@/presentation/UIManager.js';
import { Month } from '@/domain/models/Month.js';
import { Income } from '@/domain/models/Income.js';
import { Expense } from '@/domain/models/Expense.js';

describe('UIManager', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        jest.useRealTimers();
    });

    describe('updateProgressBar', () => {
        beforeEach(() => {
            container.innerHTML = '<div class="progress-bar"><div class="circle"></div><div class="circle"></div></div>';
        });

        test('should update active circle based on currentVariableExpense', () => {
            const month = new Month('January');
            month.currentVariableExpense = 1;

            UIManager.updateProgressBar(month);

            const circles = document.querySelectorAll('.circle');
            expect(circles[0].classList.contains('active')).toBeFalsy();
            expect(circles[1].classList.contains('active')).toBeTruthy();
        });
    });

    describe('updateAmount', () => {
        beforeEach(() => {
            container.innerHTML = '<div class="amount"></div>';
            jest.useFakeTimers();
        });

        test('should update amount immediately if current equals new', () => {
            UIManager.updateAmount(1000, 1000);
            expect(document.querySelector('.amount').textContent).toBe('1.000,00');
        });

        test('should animate amount change', () => {
            UIManager.updateAmount(1000, 2000);
            
            jest.advanceTimersByTime(500); // Half way through animation
            const midValue = document.querySelector('.amount').textContent;
            const midNumber = parseFloat(midValue.replace('.', '').replace(',', '.'));
            expect(midNumber).toBeGreaterThan(1000);
            expect(midNumber).toBeLessThan(2000);

            jest.advanceTimersByTime(500); // Complete animation
            expect(document.querySelector('.amount').textContent).toBe('1.992,00');
        });
    });

    describe('replaceQuestionTextVariables', () => {
        beforeEach(() => {
            container.innerHTML = '<div class="QuestionText">{{income}}{{fixed_expenses}}{{variable_expense_name}}{{variable_expense_description}}{{variable_expense_amount}}</div>';
        });

        test('should replace all variables with correct values', () => {
            const month = new Month('January');
            month.addIncome(new Income('Salary', 2000));
            month.addFixedExpense(new Expense('Rent', 'Monthly rent', 800));
            month.addVariableExpense(new Expense('Groceries', 'Weekly groceries', 200));

            UIManager.replaceQuestionTextVariables(month, '', 100);

            const content = document.querySelector('.QuestionText').innerHTML;
            expect(content).toContain('<ul><li>Salary € 2000</li></ul>');
            expect(content).toContain('<ul><li>Rent € 800</li></ul>');
            expect(content).toContain('Groceries');
            expect(content).toContain('Weekly groceries');
            expect(content).toContain('200');
        });

        test('should handle missing variable expense', () => {
            const month = new Month('January');
            UIManager.replaceQuestionTextVariables(month, '', 100);

            const content = document.querySelector('.QuestionText').innerHTML;
            expect(content).toContain('{{ERROR}}');
        });
    });

    describe('togglePreviousButton', () => {
        beforeEach(() => {
            container.innerHTML = '<button id="PreviousButton">Previous</button>';
        });

        test('should show previous button when enabled', () => {
            UIManager.togglePreviousButton(true);
            expect(document.getElementById('PreviousButton').style.display).toBe('block');
        });

        test('should hide previous button when disabled', () => {
            UIManager.togglePreviousButton(false);
            expect(document.getElementById('PreviousButton').style.display).toBe('none');
        });

        test('should handle missing button element', () => {
            container.innerHTML = '';
            expect(() => UIManager.togglePreviousButton(true)).not.toThrow();
        });
    });
});
