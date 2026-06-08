import { jest } from '@jest/globals';

// Mock performance.now() for animation testing
if (!global.performance) {
    global.performance = {};
}

let perfNowValue = 0;
global.performance.now = jest.fn(() => {
    perfNowValue += 16.67; // Simulate 60fps
    return perfNowValue;
});

// Reset performance.now mock before each test
beforeEach(() => {
    perfNowValue = 0;
    global.performance.now.mockClear();
});

// Mock requestAnimationFrame
global.requestAnimationFrame = callback => {
    setTimeout(() => callback(performance.now()), 0);
};
