import { SaldoSimulation } from '@/domain/SaldoSimulation.js';
import { Income } from '@/domain/models/Income.js';
import { Expense } from '@/domain/models/Expense.js';

describe('SaldoSimulation', () => {
    let simulation;

    beforeEach(() => {
        simulation = new SaldoSimulation(1000);
    });

    test('should create SaldoSimulation instance with correct initial saldo', () => {
        expect(simulation.getSaldo()).toBe(1000);
    });

    test('should apply incomes correctly', () => {
        const incomes = [
            new Income('Salary', '2000'),
            new Income('Bonus', '500')
        ];

        simulation.applyIncomes(incomes);
        expect(simulation.getSaldo()).toBe(3500); // 1000 + 2000 + 500
    });

    test('should apply fixed expenses correctly', () => {
        const expenses = [
            new Expense('Rent', 'Monthly rent', '800'),
            new Expense('Utilities', 'Monthly utilities', '200')
        ];

        simulation.applyFixedExpenses(expenses);
        expect(simulation.getSaldo()).toBe(0); // 1000 - 800 - 200
    });

    test('should apply variable expense correctly', () => {
        const expense = new Expense('Groceries', 'Weekly groceries', '300');
        simulation.applyVariableExpense(expense);
        expect(simulation.getSaldo()).toBe(700); // 1000 - 300
    });

    test('should handle null variable expense', () => {
        simulation.applyVariableExpense(null);
        expect(simulation.getSaldo()).toBe(1000); // No change
    });

    test('should handle complex scenario with multiple operations', () => {
        const incomes = [new Income('Salary', '2000')];
        const fixedExpenses = [new Expense('Rent', 'Monthly rent', '800')];
        const variableExpense = new Expense('Groceries', 'Weekly groceries', '300');

        simulation.applyIncomes(incomes);
        simulation.applyFixedExpenses(fixedExpenses);
        simulation.applyVariableExpense(variableExpense);

        expect(simulation.getSaldo()).toBe(1900); // 1000 + 2000 - 800 - 300
    });

    describe('applyCustomExpense', () => {
        test('should subtract valid positive amount from saldo', () => {
            const simulation = new SaldoSimulation(1000);
            simulation.applyCustomExpense(500);
            expect(simulation.getSaldo()).toBe(500);
        });

        test('should not modify saldo for negative amount', () => {
            const simulation = new SaldoSimulation(1000);
            simulation.applyCustomExpense(-500);
            expect(simulation.getSaldo()).toBe(1000);
        });

        test('should not modify saldo for zero amount', () => {
            const simulation = new SaldoSimulation(1000);
            simulation.applyCustomExpense(0);
            expect(simulation.getSaldo()).toBe(1000);
        });

        test('should not modify saldo for non-numeric input', () => {
            const simulation = new SaldoSimulation(1000);
            simulation.applyCustomExpense('500');
            expect(simulation.getSaldo()).toBe(1000);
        });
    });
});
