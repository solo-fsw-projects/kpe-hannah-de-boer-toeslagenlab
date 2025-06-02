# Toeslagen Test Environment

This is a local test environment for the Toeslagen script that simulates the Qualtrics environment. It uses the same resources (HTML, JS, CSS, images) as the production Qualtrics environment, making it easy to test changes locally.

## Features

- Simulates Qualtrics page navigation
- Mocks Qualtrics.SurveyEngine methods
- Uses the same resources as production (HTML, JS, CSS, images)
- Provides a simple UI for testing
- Includes debug information
- Supports forward and backward navigation

## Getting Started

1. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

2. Set up the test environment:
   ```bash
   npm run test:env:setup
   ```

3. Start the local test server:
   ```bash
   npm run test:env:start
   ```

4. Open your browser and navigate to: http://localhost:8000

5. Use the Next and Previous buttons to navigate between blocks
6. The debug panel shows the current state and block information

## File Structure

- `index.html` - Main HTML file for the test environment (auto-generated)
- `styles.css` - Styling for the test environment (auto-generated)
- `mock-qualtrics.js` - Mock implementation of Qualtrics.SurveyEngine
- `qualtrics-header.html` - Copied from `resources/`
- `qualtrics.js` - Copied from `resources/`
- `toeslagen.css` - Copied from `resources/`
- `pinpas.png` - Copied from `resources/`
- `test-data.csv` - Sample CSV data for testing

## Customization

You can modify the test blocks in `mock-qualtrics.js` to match your testing needs. Each block can have:

- `google_sheet_csv_url` - Path to the local CSV file with data
- `enable_previous_button` - Whether to enable the previous button
- `start_saldo` - Starting balance for the simulation
- `month` - Current month name
- `toeslag_naam` - Name of the benefit
- `toeslag_percentage` - Percentage of the benefit
- `question` - The question text to display

## Updating Resources

When you make changes to any of the resource files in the `resources/` directory, run:

```bash
npm run test:env:setup
```

This will copy the latest versions of all resource files to the test environment.

## Development Workflow

1. Make changes to the resource files in `resources/`
2. Run `npm run test:env:setup` to update the test environment
3. Run `npm run test:env:start` to start the test server
4. Test your changes in the browser at http://localhost:8000
5. Repeat as needed
