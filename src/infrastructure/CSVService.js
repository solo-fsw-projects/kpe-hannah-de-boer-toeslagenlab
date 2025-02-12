import { Month } from '../domain/models/Month.js';
import { Income } from '../domain/models/Income.js';
import { Expense } from '../domain/models/Expense.js';

export class CSVService {
    static async fetchCSV(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    }

    static convertCSVToObjects(csvData) {
        const lines = csvData.split('\n');
        if (lines.length < 2) {
            throw new Error('CSV file is empty or malformed');
        }

        const months = new Map();
        let currentMonth = null;

        lines.slice(1).forEach(line => {
            if (!line.trim()) return;
            
            const fields = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(field => field.trim().replace(/["]/g, ''));
            const monthName = fields[0];
            const income = fields[1];
            const incomeAmount = fields[2];
            const fixedExpense = fields[3];
            const fixedAmount = fields[4];
            const variableExpense = fields[5];
            const variableDescription = fields[6];
            const variableAmount = fields[7];
            
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
