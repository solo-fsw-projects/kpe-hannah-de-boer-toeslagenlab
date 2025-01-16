/**
 * @jest-environment jsdom
 */
const mockFetch = require( './mocks/fetch');

require('../src/toeslagen');
const fs = require('fs');

describe('test loading of months data', () => {
    const sheetCsv = fs.readFileSync('tests/sheet1.csv').toString();
    window.fetch = mockFetch(sheetCsv);

    test('loads months data correctly', async () => {
        await window.toeslagen.runOnNewSlide('http://localhost', 1, 0);
        const months = window.toeslagen.getMonths();
        expect(months).not.toBeNull();
        expect(months.length).toBeGreaterThan(0);
    });
});