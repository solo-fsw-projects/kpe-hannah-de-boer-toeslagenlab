import { Income } from '@/domain/models/Income.js';

describe('Income', () => {
    test('should create Income instance with correct initial values', () => {
        const income = new Income('Salary', '2000');
        expect(income.name).toBe('Salary');
        expect(income.amount).toBe(2000);
        expect(income.percentage).toBe(100);
    });

    test('should get original amount correctly', () => {
        const income = new Income('Salary', '2000');
        expect(income.getOriginalAmount()).toBe(2000);
    });

    test('should calculate amount with percentage correctly', () => {
        const income = new Income('Salary', '2000');
        income.setPercentage(50);
        expect(income.getAmount()).toBe(1000);
    });

    test('should round amount to nearest integer', () => {
        const income = new Income('Salary', '2000');
        income.setPercentage(33.33);
        expect(income.getAmount()).toBe(667); // 2000 * 0.3333 = 666.6 rounds to 667
    });

    test('should get name correctly', () => {
        const income = new Income('Salary', '2000');
        expect(income.getName()).toBe('Salary');
    });

    test('should handle string amounts', () => {
        const income = new Income('Salary', '2000.50');
        expect(income.getOriginalAmount()).toBe(2000);
    });

    test('should handle invalid amounts', () => {
        const income = new Income('Salary', 'invalid');
        expect(income.getOriginalAmount()).toBe(NaN);
    });
});
