import { Expense } from '@/domain/models/Expense.js';

describe('Expense', () => {
    test('should create Expense instance with correct initial values', () => {
        const expense = new Expense('Rent', 'Monthly rent payment', '1000');
        expect(expense.name).toBe('Rent');
        expect(expense.description).toBe('Monthly rent payment');
        expect(expense.amount).toBe(1000);
    });

    test('should get amount correctly', () => {
        const expense = new Expense('Rent', 'Monthly rent payment', '1000');
        expect(expense.getAmount()).toBe(1000);
    });

    test('should get name correctly', () => {
        const expense = new Expense('Rent', 'Monthly rent payment', '1000');
        expect(expense.getName()).toBe('Rent');
    });

    test('should get description correctly', () => {
        const expense = new Expense('Rent', 'Monthly rent payment', '1000');
        expect(expense.getDescription()).toBe('Monthly rent payment');
    });

    test('should handle string amounts', () => {
        const expense = new Expense('Rent', 'Monthly rent payment', '1000.50');
        expect(expense.getAmount()).toBe(1000);
    });

    test('should handle invalid amounts', () => {
        const expense = new Expense('Rent', 'Monthly rent payment', 'invalid');
        expect(expense.getAmount()).toBe(NaN);
    });
});
