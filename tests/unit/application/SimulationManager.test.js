import { jest } from '@jest/globals';
import { SimulationManager } from '@/application/SimulationManager.js';
import { CSVService } from '@/infrastructure/CSVService.js';

CSVService.fetchCSV = jest.fn();
CSVService.convertCSVToObjects = jest.fn();

describe('SimulationManager', () => {
    let manager;
    const mockCSVData = 'month,income,amount,fixed expenses,amount,variable expense,description,amount,total income,total fixed,total variable,balance\n' +
        'oktober 2024,Salaris,2289,Huur,628,boodschappen,Je moet boodschappen en huishoudelijke uitgaven betalen,489,2649,1554,629,466\n' +
        ',Huurtoeslag,360,Energie en water,233,kleding,Je koopt kleding,140,,,,\n' +
        ',,,Verzekeringen,244,,,,,,,\n' +
        ',,"Abonnement voor internet, TV en telefoon",141,,,,,,,\n' +
        ',,,Vervoer,308,,,,,,,';

    beforeEach(() => {
        manager = new SimulationManager();
        CSVService.fetchCSV.mockResolvedValue(mockCSVData);
        CSVService.convertCSVToObjects.mockReturnValue([
            {
                name: 'oktober 2024',
                getIncomes: () => [{
                    getName: () => 'Salaris',
                    setPercentage: jest.fn()
                }, {
                    getName: () => 'Huurtoeslag',
                    setPercentage: jest.fn()
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

    test('should initialize months from CSV data', async () => {
        await manager.initialize('http://example.com/data.csv');
        
        expect(CSVService.fetchCSV).toHaveBeenCalledWith('http://example.com/data.csv');
        expect(CSVService.convertCSVToObjects).toHaveBeenCalledWith(mockCSVData);
        expect(manager.isInitialized()).toBeTruthy();
    });

    test('should start new simulation with correct saldo', () => {
        manager.startNewSimulation(1000);
        
        expect(manager.originalSaldo).toBe(1000);
        expect(manager.previousSaldo).toBe(1000);
        expect(manager.simulation).toBeDefined();
    });

    test('should update toeslag settings', async () => {
        await manager.initialize('http://example.com/data.csv');
        
        manager.updateToeslagSettings('Huurtoeslag', 50);
        
        expect(manager.toeslagNaam).toBe('Huurtoeslag');
        expect(manager.toeslagPercentage).toBe(50);
    });

    test('should update current month', async () => {
        await manager.initialize('http://example.com/data.csv');
        
        const result = manager.updateCurrentMonth('oktober 2024');
        
        expect(result).toBeTruthy();
        expect(manager.currentMonth).toBeDefined();
        expect(manager.currentMonth.name).toBe('oktober 2024');
    });

    test('should handle invalid month name', async () => {
        await manager.initialize('http://example.com/data.csv');
        
        const result = manager.updateCurrentMonth('InvalidMonth');
        
        expect(result).toBeFalsy();
        expect(manager.currentMonth).toBeUndefined();
    });

    test('should get and update saldo values correctly', () => {
        manager.startNewSimulation(1000);
        
        expect(manager.getPreviousSaldo()).toBe(1000);
        
        manager.updatePreviousSaldo();
        expect(manager.previousSaldo).toBe(1000);
    });
});
