import { jest } from '@jest/globals';
import { SimulationManager } from '@/application/SimulationManager.js';
import { CSVService } from '@/infrastructure/CSVService.js';

CSVService.fetchCSV = jest.fn();
CSVService.convertCSVToObjects = jest.fn();

describe('SimulationManager', () => {
    let manager;
    const mockCSVData = 'month,type,name,description,amount\nJanuary,income,Salary,,2000\nJanuary,income,Toeslag,,500\nJanuary,fixed,Rent,Monthly rent,800';

    beforeEach(() => {
        manager = new SimulationManager();
        CSVService.fetchCSV.mockResolvedValue(mockCSVData);
        CSVService.convertCSVToObjects.mockReturnValue([
            {
                name: 'January',
                getIncomes: () => [{
                    getName: () => 'Salary',
                    setPercentage: jest.fn()
                }, {
                    getName: () => 'Toeslag',
                    setPercentage: jest.fn()
                }]
            }
        ]);
    });

    test('should initialize with correct default values', () => {
        expect(manager.simulation).toBeNull();
        expect(manager.months).toBeNull();
        expect(manager.currentMonth).toBeNull();
        expect(manager.originalSaldo).toBe(0);
        expect(manager.currentSaldo).toBe(0);
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
        expect(manager.currentSaldo).toBe(1000);
        expect(manager.previousSaldo).toBe(1000);
        expect(manager.simulation).toBeDefined();
    });

    test('should update toeslag settings', async () => {
        await manager.initialize('http://example.com/data.csv');
        
        manager.updateToeslagSettings('Toeslag', 50);
        
        expect(manager.toeslagNaam).toBe('Toeslag');
        expect(manager.toeslagPercentage).toBe(50);
    });

    test('should update current month', async () => {
        await manager.initialize('http://example.com/data.csv');
        
        const result = manager.updateCurrentMonth('January');
        
        expect(result).toBeTruthy();
        expect(manager.currentMonth).toBeDefined();
        expect(manager.currentMonth.name).toBe('January');
    });

    test('should handle invalid month name', async () => {
        await manager.initialize('http://example.com/data.csv');
        
        const result = manager.updateCurrentMonth('InvalidMonth');
        
        expect(result).toBeFalsy();
        expect(manager.currentMonth).toBeUndefined();
    });

    test('should get and update saldo values correctly', () => {
        manager.startNewSimulation(1000);
        
        expect(manager.getCurrentSaldo()).toBe(1000);
        expect(manager.getPreviousSaldo()).toBe(1000);
        
        manager.updatePreviousSaldo();
        expect(manager.previousSaldo).toBe(1000);
    });
});
