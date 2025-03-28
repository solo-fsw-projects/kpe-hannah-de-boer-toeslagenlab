import { CSVService } from '@/infrastructure/CSVService.js';
import { Month } from '@/domain/models/Month.js';
import { Income } from '@/domain/models/Income.js';
import { Expense } from '@/domain/models/Expense.js';

describe('CSVService', () => {
    beforeEach(() => {
        global.fetch.mockClear();
    });

    describe('fetchCSV', () => {
        test('should fetch CSV data successfully', async () => {
            const mockCSVData = 'month,income,amount,fixed expenses,amount,variable expense,description,amount\nJanuary,Salary,2000,,,,,';
            global.fetch.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve(mockCSVData)
            });

            const result = await CSVService.fetchCSV('http://example.com/data.csv');
            expect(result).toBe(mockCSVData);
            expect(fetch).toHaveBeenCalledWith('http://example.com/data.csv');
        });

        test('should throw error when fetch fails', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 404
            });

            await expect(CSVService.fetchCSV('http://example.com/data.csv'))
                .rejects
                .toThrow('HTTP error! status: 404');
        });
    });

    describe('convertCSVToObjects', () => {
        test('should convert CSV data to Month objects', () => {
            const csvData = 'month,income,amount,fixed expenses,amount,variable expense,description,amount\nJanuary,Salary,2000,Rent,800,Groceries,Weekly groceries,200\n,,,,,,,\nFebruary,Salary,2000,,,,,';

            const months = CSVService.convertCSVToObjects(csvData);

            expect(months).toHaveLength(2);
            expect(months[0]).toBeInstanceOf(Month);
            expect(months[0].name).toBe('January');
            expect(months[0].getIncomes()).toHaveLength(1);
            expect(months[0].getFixedExpenses()).toHaveLength(1);
            expect(months[0].getVariableExpenses()).toHaveLength(1);
        });

        test('should handle empty CSV data', () => {
            const csvData = 'month,type,name,description,amount\n';
            const months = CSVService.convertCSVToObjects(csvData);
            expect(months).toHaveLength(0);
        });

        test('should handle malformed CSV data', () => {
            const csvData = 'invalid data';
            expect(() => CSVService.convertCSVToObjects(csvData))
                .toThrow('CSV file is empty or malformed');
        });

        test('should skip empty lines', () => {
            const csvData = 'month,type,name,description,amount\nJanuary,income,Salary,,2000\n\nFebruary,income,Salary,,2000';

            const months = CSVService.convertCSVToObjects(csvData);
            expect(months).toHaveLength(2);
        });

        test('should handle unknown transaction types', () => {
            const csvData = 'month,income,amount,fixed expenses,amount,variable expense,description,amount\nJanuary,,,,,,,';

            const months = CSVService.convertCSVToObjects(csvData);
            expect(months).toHaveLength(1);
            expect(months[0].getIncomes()).toHaveLength(0);
            expect(months[0].getFixedExpenses()).toHaveLength(0);
            expect(months[0].getVariableExpenses()).toHaveLength(0);
        });
    });
});
