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
            <div id="NextButton" style="display: none;"></div>
            <div id="saldo"></div>
            <div class="progress-bar">
                <div class="circle-container">
                    <div class="month-name"></div>
                </div>
                <div class="amount"></div>
            </div>
            <div id="loading" style="display: none;">Loading...</div>
        `;
        
        // Setup mock data
        sheetCsv = fs.readFileSync('tests/sheet1.csv').toString();
        window.fetch = mockFetch(sheetCsv);
    });

    describe('End-to-End Flow', () => {
        test('completes full simulation flow', async () => {
            // Initial load
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            expect(document.querySelector('.month-name').textContent.trim()).toBe('oktober 2024');
            expect(document.querySelector('.amount').textContent).toBe('1000');

            // Apply incomes
            await window.toeslagen.applyIncomes();
            await new Promise(resolve => setTimeout(resolve, 1000));
            const afterIncomes = parseInt(document.querySelector('.amount').textContent);
            expect(afterIncomes).toBe(3649); // 1000 + 2289 + 360

            // Apply fixed expenses
            await window.toeslagen.applyFixedExpenses();
            await new Promise(resolve => setTimeout(resolve, 1000));
            const afterFixed = parseInt(document.querySelector('.amount').textContent);
            expect(afterFixed).toBe(2095); // 3649 - (628 + 233 + 244 + 141 + 308)

            // Apply variable expense
            await window.toeslagen.applyVariableExpense();
            await new Promise(resolve => setTimeout(resolve, 1000));
            const afterVariable = parseInt(document.querySelector('.amount').textContent);
            expect(afterVariable).toBe(1606); // 2095 - 489
        });
    });

    describe('Navigation and State', () => {
        test('maintains state when navigating between months', async () => {
            // Start in October
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            await window.toeslagen.applyIncomes();
            await new Promise(resolve => setTimeout(resolve, 1000));
            const octoberSaldo = parseInt(document.querySelector('.amount').textContent);

            // Move to November
            await window.toeslagen.runOnNewSlide('http://localhost', true, octoberSaldo, 'november 2024', '', 100);
            expect(parseInt(document.querySelector('.amount').textContent)).toBe(octoberSaldo);
            expect(document.querySelector('.month-name').textContent.trim()).toBe('november 2024');
        });

        test('handles missing DOM elements gracefully', async () => {
            document.querySelector('.QuestionText').remove();
            await window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            // Should not throw errors and should still show formatted amount
            expect(document.querySelector('.amount').textContent).toBe('1000');
        });
    });

    describe('UI Updates', () => {
        beforeEach(() => {
            // Reset loading state
            const loading = document.querySelector('#loading');
            if (loading) {
                loading.style.display = 'none';
            }
        });

        test('shows loading state during data fetch', async () => {
            const slowFetch = new Promise(resolve => setTimeout(resolve, 500));
            window.fetch = jest.fn().mockImplementation(() => slowFetch.then(() => new Response(sheetCsv)));
            
            // Add loading element if not present
            if (!document.querySelector('#loading')) {
                const loading = document.createElement('div');
                loading.id = 'loading';
                loading.style.display = 'none';
                document.body.appendChild(loading);
            }
            
            const loadPromise = window.toeslagen.runOnNewSlide('http://localhost', true, 1000, 'oktober 2024', '', 100);
            // Loading state should be visible immediately
            expect(document.querySelector('#loading').style.display).toBe('block');
            
            await loadPromise;
            // Loading state should be hidden after completion
            expect(document.querySelector('#loading').style.display).toBe('none');
        });

        test('updates question text with real-world data format', async () => {
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
            // Wait for template update and data load
            await new Promise(resolve => setTimeout(resolve, 500));
            const questionText = document.querySelector('.QuestionText').innerHTML;
            expect(questionText).toMatch(/€\s*288/); // 80% of 360 without formatting
        });
    });
});

