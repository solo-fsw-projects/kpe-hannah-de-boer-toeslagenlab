import { jest } from '@jest/globals';
import { Month } from '@/domain/models/Month.js';

const mockReadExcel = jest.fn();

jest.unstable_mockModule('read-excel-file/browser', () => ({
    default: mockReadExcel
}));

const { SheetService } = await import('@/infrastructure/SheetService.js');

describe('SheetService', () => {
    beforeEach(() => {
        mockReadExcel.mockClear();
    });

    describe('fetchFromUrl', () => {
        test('should fetch sheet data successfully', async () => {
            const mockSheetData = [
                ['month', 'income', 'amount', 'fixed expenses', 'amount', 'variable expense', 'description', 'amount'],
                ['January', 'Salary', 2000, '', '', '', '', '']
            ];

            global.fetch = jest.fn().mockResolvedValueOnce({
                ok: true,
                blob: jest.fn().mockResolvedValueOnce(new Blob())
            });
            mockReadExcel.mockResolvedValueOnce([{ data: mockSheetData }]);

            const result = await SheetService.fetchFromUrl('http://example.com/data.xlsx', 'Sheet1');

            expect(result).toBe(mockSheetData);
            expect(global.fetch).toHaveBeenCalledWith('http://example.com/data.xlsx');
            expect(mockReadExcel).toHaveBeenCalledWith(expect.any(Blob), { sheets: ['Sheet1'] });
        });

        test('should throw error when HTTP request fails', async () => {
            global.fetch = jest.fn().mockResolvedValueOnce({
                ok: false,
                status: 404
            });

            await expect(SheetService.fetchFromUrl('http://example.com/data.xlsx', 'Sheet1'))
                .rejects
                .toThrow('HTTP error! status: 404');
        });

        test('should throw error when reading sheet fails', async () => {
            global.fetch = jest.fn().mockResolvedValueOnce({
                ok: true,
                blob: jest.fn().mockResolvedValueOnce(new Blob())
            });
            mockReadExcel.mockRejectedValueOnce(new Error('Failed to read file'));

            await expect(SheetService.fetchFromUrl('http://example.com/data.xlsx', 'Sheet1'))
                .rejects
                .toThrow('Failed to read file');
        });
    });

    describe('convertSheetToObjects', () => {
        test('should convert sheet data to Month objects', () => {
            const sheetData = [
                ['month', 'income', 'amount', 'fixed expenses', 'amount', 'variable expense', 'description', 'amount'],
                ['January', 'Salary', 2000, 'Rent', 800, 'Groceries', 'Weekly groceries', 200],
                ['', '', '', '', '', '', '', ''],
                ['February', 'Salary', 2000, '', '', '', '', '']
            ];

            const months = SheetService.convertSheetToObjects(sheetData);

            expect(months).toHaveLength(2);
            expect(months[0]).toBeInstanceOf(Month);
            expect(months[0].name).toBe('January');
            expect(months[0].getIncomes()).toHaveLength(1);
            expect(months[0].getFixedExpenses()).toHaveLength(1);
            expect(months[0].getVariableExpenses()).toHaveLength(1);
        });

        test('should handle empty sheet data', () => {
            const sheetData = [
                ['month', 'income', 'amount', 'fixed expenses', 'amount', 'variable expense', 'description', 'amount']
            ];

            expect(() => SheetService.convertSheetToObjects(sheetData))
                .toThrow('CSV file is empty or malformed');
        });

        test('should handle malformed sheet data', () => {
            const sheetData = [];

            expect(() => SheetService.convertSheetToObjects(sheetData))
                .toThrow('CSV file is empty or malformed');
        });

        test('should skip rows before the first month', () => {
            const sheetData = [
                ['month', 'income', 'amount', 'fixed expenses', 'amount', 'variable expense', 'description', 'amount'],
                ['', 'Salary', 2000, '', '', '', '', ''],
                ['January', 'Salary', 2000, '', '', '', '', ''],
                ['February', 'Salary', 2000, '', '', '', '', '']
            ];

            const months = SheetService.convertSheetToObjects(sheetData);

            expect(months).toHaveLength(2);
        });

        test('should handle rows without transactions', () => {
            const sheetData = [
                ['month', 'income', 'amount', 'fixed expenses', 'amount', 'variable expense', 'description', 'amount'],
                ['January', '', '', '', '', '', '', '']
            ];

            const months = SheetService.convertSheetToObjects(sheetData);

            expect(months).toHaveLength(1);
            expect(months[0].getIncomes()).toHaveLength(0);
            expect(months[0].getFixedExpenses()).toHaveLength(0);
            expect(months[0].getVariableExpenses()).toHaveLength(0);
        });
    });
});
