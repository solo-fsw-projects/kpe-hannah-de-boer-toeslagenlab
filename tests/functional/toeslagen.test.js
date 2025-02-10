/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';
import mockFetch from '../mocks/fetch.js';
import '@/toeslagen.js';
import fs from 'fs';

describe('Toeslagen Module Tests', () => {
    let sheetCsv;
    
    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = `
            <div class="QuestionText">
                <p>Je inkomen bestaat uit:</p>
                {{income}}
                <p>Je vaste lasten zijn:</p>
                {{fixed_expenses}}
                <p>Je variabele uitgave is:</p>
                <p>{{variable_expense_name}}: {{variable_expense_description}} &euro; {{variable_expense_amount}}</p>
            </div>
            <div id="PreviousButton" style="display: none;"></div>
            <div id="saldo"></div>
            <div class="progress-bar">
                <div class="circle-container">
                    <div class="month-name"></div>
                </div>
                <div class="amount"></div>
            </div>
        `;
        
        // Setup mock data
        sheetCsv = fs.readFileSync('tests/sheet1.csv').toString();
        window.fetch = mockFetch(sheetCsv);
    });

    describe('Data Loading', () => {
        test('loads months data correctly', async () => {
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            const months = window.toeslagen.getMonths();
            expect(months).not.toBeNull();
            expect(months.length).toBeGreaterThan(0);
            expect(months[0].name).toBe('oktober 2024');
            expect(months[0].getIncomes().length).toBeGreaterThan(0);
            expect(months[0].getFixedExpenses().length).toBeGreaterThan(0);
        });

        test('handles invalid sheet URL', async () => {
            const errorResponse = new Error('Failed to fetch');
            window.fetch = jest.fn().mockRejectedValue(errorResponse);
            await window.toeslagen.runOnNewSlide('http://invalid', true, 1000, 'oktober 2024', '', 100);
            const months = window.toeslagen.getMonths();
            expect(months).toBeDefined();
            expect(Array.isArray(months)).toBe(true);
            expect(months).toEqual([]);
        });

        test('handles malformed CSV data', async () => {
            window.fetch = mockFetch('this is not a CSV file at all');
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            const months = window.toeslagen.getMonths();
            expect(months).toBeDefined();
            expect(months).toEqual([]);
        });
    });

    describe('Simulation Functionality', () => {
        jest.setTimeout(20000);
        test('starts new simulation with correct initial saldo', async () => {
            const startSaldo = 2000;
            await window.toeslagen.runOnNewSlide('http://localhost', true, startSaldo, 'oktober 2024', '', 100);
            
            // Wait for animation frames to complete (60 frames)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const amountElement = document.querySelector('.progress-bar .amount');
            expect(parseInt(amountElement.textContent)).toBe(startSaldo);
        });

        test('applies income correctly', async () => {

            const startSaldo = 1000;
            await window.toeslagen.runOnNewSlide('http://localhost', true, startSaldo, 'oktober 2024', '', 100);
            
            const initialSaldo = parseInt(document.querySelector('.progress-bar .amount').textContent);
            window.toeslagen.applyIncomes();
            await window.toeslagen.runOnNewSlide('http://localhost', true, startSaldo, 'oktober 2024', '', 100);
            
            // Wait for animation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const currentSaldo = parseInt(document.querySelector('.progress-bar .amount').textContent);
            expect(currentSaldo).toBeGreaterThan(initialSaldo);
            expect(currentSaldo).toBe(initialSaldo + 2289 + 360); // Salaris + Huurtoeslag
        });

        test('applies fixed expenses correctly', async () => {

            const startSaldo = 2000;
            await window.toeslagen.runOnNewSlide('http://localhost', true, startSaldo, 'oktober 2024', '', 100);
            
            const initialSaldo = parseInt(document.querySelector('.progress-bar .amount').textContent);
            window.toeslagen.applyFixedExpenses();
            await window.toeslagen.runOnNewSlide('http://localhost', true, startSaldo, 'oktober 2024', '', 100);
            
            // Wait for animation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const currentSaldo = parseInt(document.querySelector('.progress-bar .amount').textContent);
            expect(currentSaldo).toBeLessThan(initialSaldo);
            expect(currentSaldo).toBe(initialSaldo - 628 - 233 - 244 - 141 - 308); // Sum of all fixed expenses
        });

        test('applies variable expenses correctly', async () => {

            const startSaldo = 2000;
            await window.toeslagen.runOnNewSlide('http://localhost', true, startSaldo, 'oktober 2024', '', 100);
            
            const initialSaldo = parseInt(document.querySelector('.progress-bar .amount').textContent);
            window.toeslagen.applyVariableExpense();
            await window.toeslagen.runOnNewSlide('http://localhost', true, startSaldo, 'oktober 2024', '', 100);
            
            // Wait for animation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const currentSaldo = parseInt(document.querySelector('.progress-bar .amount').textContent);
            expect(currentSaldo).toBeLessThan(initialSaldo);
            expect(currentSaldo).toBe(initialSaldo - 489); // First variable expense
        });
    });

    describe('UI Interactions', () => {
        test('shows previous button when enabled', async () => {
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            const button = document.querySelector('#PreviousButton');
            expect(button.style.display).toBe('block');
        });

        test('hides previous button when disabled', async () => {
            await window.toeslagen.runOnNewSlide('http://localhost', false, 1000, 'oktober 2024', '', 100);
            const button = document.querySelector('#PreviousButton');
            expect(button.style.display).toBe('none');
        });

        test('updates question text variables', async () => {
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            const questionText = document.querySelector('.QuestionText').innerHTML;
            expect(questionText).toContain('<ul>');
            expect(questionText).toContain('Salaris');
            expect(questionText).toContain('Huurtoeslag');
            expect(questionText).toContain('2289'); // Salary amount
            expect(questionText).toContain('360'); // Huurtoeslag amount
        });

        test('updates progress bar', async () => {
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            const monthName = document.querySelector('.month-name');
            const amount = document.querySelector('.amount');
            expect(monthName.textContent).toBe('oktober 2024');
            expect(amount.textContent).toBe('1000');
        });
    });

    describe('Toeslag Percentage Handling', () => {
        test('applies toeslag percentage correctly', async () => {
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', 'Huurtoeslag', 80);
            const questionText = document.querySelector('.QuestionText').innerHTML;
            expect(questionText).toContain('Huurtoeslag');
            expect(questionText).toContain('288'); // 80% of 360
        });

        test('does not modify non-toeslag incomes', async () => {
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', 'Huurtoeslag', 80);
            const months = window.toeslagen.getMonths();
            const salaris = months[0].getIncomes().find(income => income.getName() === 'Salaris');
            expect(salaris.getAmount()).toBe(2289); // Original amount unchanged
        });
    });
});
