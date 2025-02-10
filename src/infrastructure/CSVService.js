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
        lines.slice(1).forEach(line => {
            if (!line.trim()) return;
            
            const [monthName, type, name, description, amount] = line.split(',').map(field => field.trim());
            
            if (!months.has(monthName)) {
                months.set(monthName, new Month(monthName));
            }
            
            const month = months.get(monthName);
            
            switch(type.toLowerCase()) {
                case 'income':
                    month.addIncome(new Income(name, amount));
                    break;
                case 'fixed':
                    month.addFixedExpense(new Expense(name, description, amount));
                    break;
                case 'variable':
                    month.addVariableExpense(new Expense(name, description, amount));
                    break;
            }
        });

        return Array.from(months.values());
    }
}
