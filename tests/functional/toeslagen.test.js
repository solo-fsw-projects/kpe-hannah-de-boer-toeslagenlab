/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';
import mockFetch from '../mocks/fetch.js';
// Dynamic import for toeslagen module to allow reloading
let toeslag;

import fs from 'fs';

/**
 * The only thing that is running async when calling runOnNewSlide is the saldo amount change animation
 */
describe('Toeslagen Module Tests', () => {
    let sheetCsv;
    
    beforeEach(async () => {
        // Delete the existing toeslagen object
        delete window.toeslagen;
        
        // Reload toeslagen module
        jest.resetModules();
        toeslag = await import('@/toeslagen.js');
        
        // // Wait for toeslagen to be available
        // await waitForToeslagen();

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
            <div id="NextButton" style="display: none;"></div>
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

    describe('End-to-End Flow', () => {
        test('applies custom expense correctly', async () => {
            // Initial load
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);

            expect(document.querySelector('.amount').textContent).toBe('1000');

            // Apply custom expense and check UI update
            window.toeslagen.applyCustomExpense(250);
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(document.querySelector('.amount').textContent).toBe('750'); // 1000 - 250

            // Apply another custom expense
            window.toeslagen.applyCustomExpense(300);
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(document.querySelector('.amount').textContent).toBe('450'); // 750 - 300
        });


        test('completes full simulation flow', async () => {

            // Initial load
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);

            expect(document.querySelector('.month-name').textContent.trim()).toBe('oktober 2024');
            expect(document.querySelector('.amount').textContent).toBe('1000');

            // Apply incomes and check UI update
            window.toeslagen.applyIncomes();
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(document.querySelector('.amount').textContent).toBe('3649'); // 1000 + 2289 + 360

            // Apply fixed expenses and check UI update
            window.toeslagen.applyFixedExpenses();
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(document.querySelector('.amount').textContent).toBe('2095'); // 3649 - (628 + 233 + 244 + 141 + 308)

            // Apply variable expense and check UI update
            window.toeslagen.applyVariableExpense();
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(document.querySelector('.amount').textContent).toBe('1606'); // 2095 - 489
        });
    });

    describe('Navigation and State', () => {
        test('maintains state when navigating between months', async () => {
            
            // Start in October
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);

            // Apply incomes and check UI update
            window.toeslagen.applyIncomes();
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(document.querySelector('.amount').textContent).toBe('3649'); // 1000 + 2289 + 360

            // Move to November and apply incomes and check UI update
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'november 2024', '', 100);
            window.toeslagen.applyIncomes();
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'november 2024', '', 100);
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(document.querySelector('.amount').textContent).toBe('5787'); // 3649 + 1778 + 360 = 5787
            expect(document.querySelector('.month-name').textContent.trim()).toBe('november 2024');
        });
    });

    describe('Progress Bar', () => {
        // Position is from 0 to 65% for 12 months in sheets1.csv
        test('positions circle correctly for different months', async () => {
            const getPosition = () => document.querySelector('.circle-container').style.left;
            
            // Init
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);

            // Initialize and test key positions
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100); // 1 of 12
            expect(getPosition()).toBe('calc(0\% - 18px)');

            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'april 2025', '', 100); // 7 of 12
            expect(getPosition()).toMatch(/calc\(35\.\d+\% - 18px\)/);

            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'maart 2026', '', 100); // 12 of 12
            expect(getPosition()).toMatch(/calc\(65\% - 18px\)/);
        });
    });

    describe('UI Updates', () => {
        test('updates question text with real-world data format', async () => {
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);

            // Wait for template update and data load
            await new Promise(resolve => setTimeout(resolve, 500));
            const questionText = document.querySelector('.QuestionText').innerHTML;
            
            // Check income formatting
            expect(questionText).toMatch(/€\s*2289/); // Salary without formatting
            expect(questionText).toMatch(/€\s*360/); // Huurtoeslag without formatting
            
            // Check expense formatting
            expect(questionText).toMatch(/€\s*628/); // Rent without formatting
        });
    });

    describe('Toeslag Calculation', () => {
        test('applies toeslag percentage with proper rounding', async () => {
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', 'Huurtoeslag', 80);
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', 'Huurtoeslag', 80);

            // Wait for template update and data load
            await new Promise(resolve => setTimeout(resolve, 500));
            const questionText = document.querySelector('.QuestionText').innerHTML;
            expect(questionText).toMatch(/€\s*288/); // 80% of 360 without formatting
        });
    });
});

