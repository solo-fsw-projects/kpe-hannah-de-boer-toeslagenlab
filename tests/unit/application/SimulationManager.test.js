import { jest } from '@jest/globals';
import { SimulationManager } from '@/application/SimulationManager.js';
import { SheetService } from '@/infrastructure/SheetService.js';

SheetService.fetchFromUrl = jest.fn();
SheetService.convertSheetToObjects = jest.fn();

describe('SimulationManager', () => {
    let manager;
    const mockSheetData = [
        ['month', 'income', 'amount', 'fixed expenses', 'amount', 'variable expense', 'description', 'amount'],
        ['oktober 2024', 'Salaris', 2289, 'Huur', 628, 'boodschappen', 'Je moet boodschappen en huishoudelijke uitgaven betalen', 489],
        ['', 'Huurtoeslag', 360, 'Energie en water', 233, 'kleding', 'Je koopt kleding', 140],
        ['', '', '', 'Verzekeringen', 244, '', '', ''],
        ['', '', '', 'Abonnement voor internet, TV en telefoon', 141, '', '', ''],
        ['', '', '', 'Vervoer', 308, '', '', '']
    ];

    beforeEach(() => {
        manager = new SimulationManager();
        SheetService.fetchFromUrl.mockResolvedValue(mockSheetData);
        SheetService.convertSheetToObjects.mockReturnValue([
            {
                name: 'oktober 2024',
                getIncomes: () => [{
                    getName: () => 'Salaris',
                    setPercentage: jest.fn(),
                    getPercentage: () => 0
                }, {
                    getName: () => 'Huurtoeslag',
                    setPercentage: jest.fn(),
                    getPercentage: () => 0
                }],
                getFixedExpenses: () => [
                    { getName: () => 'Huur', getAmount: () => 628 },
                    { getName: () => 'Energie en water', getAmount: () => 233 },
                    { getName: () => 'Verzekeringen', getAmount: () => 244 },
                    { getName: () => 'Abonnement voor internet, TV en telefoon', getAmount: () => 141 },
                    { getName: () => 'Vervoer', getAmount: () => 308 }
                ],
                getVariableExpenses: () => [
                    { getName: () => 'boodschappen', getAmount: () => 489, getDescription: () => 'Je moet boodschappen en huishoudelijke uitgaven betalen' },
                    { getName: () => 'kleding', getAmount: () => 140, getDescription: () => 'Je koopt kleding' }
                ],
                getTotalIncome: () => 2649,
                getTotalFixed: () => 1554,
                getTotalVariable: () => 629,
                getBalance: () => 466
            }
        ]);
    });

    test('should initialize with correct default values', () => {
        expect(manager.simulation).toBeNull();
        expect(manager.months).toBeNull();
        expect(manager.currentMonth).toBeNull();
        expect(manager.originalSaldo).toBe(0);
        expect(manager.previousSaldo).toBe(0);
        expect(manager.toeslagNaam).toBe('');
        expect(manager.toeslagPercentage).toBe(0);
    });

    test('should initialize months from sheet data', async () => {
        await manager.initialize('http://example.com/data.xlsx', 'Scenario A');

        expect(SheetService.fetchFromUrl).toHaveBeenCalledWith('http://example.com/data.xlsx', 'Scenario A');
        expect(SheetService.convertSheetToObjects).toHaveBeenCalledWith(mockSheetData);
        expect(manager.isInitialized()).toBeTruthy();
    });

    test('should start new simulation with correct saldo', () => {
        manager.startNewSimulation(1000);
        
        expect(manager.originalSaldo).toBe(1000);
        expect(manager.previousSaldo).toBe(1000);
        expect(manager.simulation).toBeDefined();
    });

    test('should throw error when starting simulation with non-number saldo', () => {
        expect(() => manager.startNewSimulation('1000')).toThrow('startSaldo must be a number');
        expect(() => manager.startNewSimulation(undefined)).toThrow('startSaldo must be a number');
        expect(() => manager.startNewSimulation(null)).toThrow('startSaldo must be a number');
    });

    test('should update toeslag settings', async () => {
        await manager.initialize('http://example.com/data.xlsx', 'Sheet1');
        
        manager.applyToeslagSettings('Huurtoeslag', 50);
        
        expect(manager.toeslagNaam).toBe('Huurtoeslag');
        expect(manager.toeslagPercentage).toBe(50);
    });

    test('should throw error when updating toeslag settings with invalid types', async () => {
        await manager.initialize('http://example.com/data.xlsx', 'Sheet1');
        
        expect(() => manager.applyToeslagSettings(123, 50)).toThrow('naam must be a string');
        expect(() => manager.applyToeslagSettings('Huurtoeslag', '50')).toThrow('percentage must be a number');
        expect(() => manager.applyToeslagSettings(null, null)).toThrow('naam must be a string');
    });

    test('should update current month', async () => {
        await manager.initialize('http://example.com/data.xlsx', 'Sheet1');
        
        const result = manager.setCurrentMonth('oktober 2024');
        
        expect(result).toBeTruthy();
        expect(manager.currentMonth).toBeDefined();
        expect(manager.currentMonth.name).toBe('oktober 2024');
    });

    test('should handle invalid month name', async () => {
        await manager.initialize('http://example.com/data.xlsx', 'Sheet1');
        
        const result = manager.setCurrentMonth('InvalidMonth');
        
        expect(result).toBeFalsy();
        expect(manager.currentMonth).toBeUndefined();
    });

    test('should throw error when updating current month with non-string name', async () => {
        await manager.initialize('http://example.com/data.xlsx', 'Sheet1');
        
        expect(() => manager.setCurrentMonth(123)).toThrow('monthName must be a string');
        expect(() => manager.setCurrentMonth(undefined)).toThrow('monthName must be a string');
        expect(() => manager.setCurrentMonth(null)).toThrow('monthName must be a string');
    });

    test('should throw error when applying custom expense with non-number amount', () => {
        manager.startNewSimulation(1000);
        
        expect(() => manager.applyCustomExpense('100')).toThrow('amount must be a number');
        expect(() => manager.applyCustomExpense(undefined)).toThrow('amount must be a number');
        expect(() => manager.applyCustomExpense(null)).toThrow('amount must be a number');
    });

    describe('applyCustomExpense', () => {
        test('should not apply custom expense when simulation is not initialized', () => {
            manager.applyCustomExpense(500);
            expect(manager.getCurrentSaldo()).toBe(0);
        });

        test('should apply custom expense when simulation is initialized', () => {
            manager.startNewSimulation(1000);
            manager.applyCustomExpense(500);
            expect(manager.getCurrentSaldo()).toBe(500);
        });
    });

    test('should get and update saldo values correctly', () => {
        manager.startNewSimulation(1000);
        
        expect(manager.getPreviousSaldo()).toBe(1000);
        
        manager.updatePreviousSaldo();
        expect(manager.previousSaldo).toBe(1000);
    });
});
