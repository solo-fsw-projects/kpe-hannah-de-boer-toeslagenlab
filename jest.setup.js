// Mock fetch globally
global.fetch = jest.fn();

// Setup fetch mock reset
beforeEach(() => {
    global.fetch.mockClear();
});
