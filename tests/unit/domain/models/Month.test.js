import { Month } from '@/domain/models/Month.js';
import { Income } from '@/domain/models/Income.js';
import { Expense } from '@/domain/models/Expense.js';

describe('Month', () => {
    let month;

    beforeEach(() => {
        month = new Month('January');
    });

    test('should create a Month instance with correct initial values', () => {
        expect(month.name).toBe('January');
        expect(month.incomes).toEqual([]);
        expect(month.fixedExpenses).toEqual([]);
        expect(month.variableExpenses).toEqual([]);
        expect(month.variableExpenseCounter).toBe(0);
    });

    test('should add income correctly', () => {
        const income = new Income('Salary', 2000);
        month.addIncome(income);
        expect(month.incomes).toHaveLength(1);
        expect(month.incomes[0]).toBe(income);
    });

    test('should add fixed expense correctly', () => {
        const expense = new Expense('Rent', 'Monthly rent', 1000);
        month.addFixedExpense(expense);
        expect(month.fixedExpenses).toHaveLength(1);
        expect(month.fixedExpenses[0]).toBe(expense);
    });

    test('should add variable expense correctly', () => {
        const expense = new Expense('Groceries', 'Weekly groceries', 100);
        month.addVariableExpense(expense);
        expect(month.variableExpenses).toHaveLength(1);
        expect(month.variableExpenses[0]).toBe(expense);
    });

    test('should get next variable expense with increment', () => {
        const expense1 = new Expense('Groceries', 'Weekly groceries', 100);
        const expense2 = new Expense('Entertainment', 'Movies', 50);
        month.addVariableExpense(expense1);
        month.addVariableExpense(expense2);

        const firstExpense = month.getNextVariableExpense(true);
        expect(firstExpense).toBe(expense1);
        expect(month.variableExpenseCounter).toBe(1);

        const secondExpense = month.getNextVariableExpense(true);
        expect(secondExpense).toBe(expense2);
        expect(month.variableExpenseCounter).toBe(2);

        const noMoreExpense = month.getNextVariableExpense(true);
        expect(noMoreExpense).toBeNull();
    });

    test('should get next variable expense without increment', () => {
        const expense = new Expense('Groceries', 'Weekly groceries', 100);
        month.addVariableExpense(expense);

        const firstLook = month.getNextVariableExpense(false);
        expect(firstLook).toBe(expense);
        expect(month.variableExpenseCounter).toBe(0);

        const secondLook = month.getNextVariableExpense(false);
        expect(secondLook).toBe(expense);
        expect(month.variableExpenseCounter).toBe(0);
    });
});
