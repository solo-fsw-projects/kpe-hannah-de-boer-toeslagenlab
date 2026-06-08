import { Month } from '../domain/models/Month.js';
import { Income } from '../domain/models/Income.js';
import { Expense } from '../domain/models/Expense.js';
import readExcel from 'read-excel-file/browser';

export class SheetService {
    static async fetchFromUrl(url, sheetName) {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const results = await readExcel(arrayBuffer, { sheets: [sheetName] });
        return results[0].data;
    }

    static convertSheetToObjects(sheet) {
        if (sheet.length < 2) {
            throw new Error('CSV file is empty or malformed');
        }

        const months = new Map();
        let currentMonth = null;

        sheet.slice(1).forEach(row => {
            const monthName = row[0];
            const income = row[1];
            const incomeAmount = row[2];
            const fixedExpense = row[3];
            const fixedAmount = row[4];
            const variableExpense = row[5];
            const variableDescription = row[6];
            const variableAmount = row[7];

            if (monthName) {
                currentMonth = new Month(monthName);
                months.set(monthName, currentMonth);
            }

            if (!currentMonth) return;

            if (income && incomeAmount) {
                currentMonth.addIncome(new Income(income, parseInt(incomeAmount)));
            }

            if (fixedExpense && fixedAmount) {
                currentMonth.addFixedExpense(new Expense(fixedExpense, '', parseInt(fixedAmount)));
            }

            if (variableExpense && variableAmount) {
                currentMonth.addVariableExpense(new Expense(variableExpense, variableDescription, parseInt(variableAmount)));
            }
        });

        return Array.from(months.values());
    }
}
