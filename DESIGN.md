# Toeslagen — Technical Design

## Overview

The Toeslagen application is a web-based financial simulation embedded in Qualtrics surveys. Participants progress through a series of slides representing monthly income and expense events. The application tracks a running balance (saldo) and updates the UI after each transaction.

## Architecture

```
toeslagen.js (entry point + public API)
├── application/SimulationManager
├── domain/SaldoSimulation
│   └── models: Month, Income, Expense
├── infrastructure/SheetService
└── presentation/UIManager
```

### Components

**`toeslagen.js`** — Loaded once per survey session. Exposes `window.toeslagen` and wires up Qualtrics hooks via `base-header.html`.

**`SimulationManager`** — Orchestrates the simulation:
- Initialises from Excel data (`sheet_url` + `sheet_name`)
- Manages saldo, current month, toeslag settings
- Tracks slide history for backward navigation

**`SaldoSimulation`** — Core financial logic: applies incomes and expenses to the running balance.

**`Month` / `Income` / `Expense`** — Domain models. `Income` supports an adjustable percentage (used for toeslagen).

**`SheetService`** — Fetches an `.xlsx` file from a URL, reads a named sheet via `read-excel-file/browser`, and converts rows to domain objects.

**`UIManager`** — Updates progress bar, animates saldo display, replaces `{{variables}}` in Qualtrics question text, controls navigation button visibility.

## Qualtrics Integration

### Embedded Variables

Each Qualtrics block passes state via embedded variables:

| Variable | Description |
|---|---|
| `sheet_url` | URL to the Excel file |
| `sheet_name` | Name of the sheet to load within that file |
| `enable_previous_button` | `'1'` to show the previous button, `'0'` to hide |
| `start_saldo` | Starting balance for the simulation (numeric string) |
| `month` | Name of the month to activate on this slide |
| `toeslag_naam` | Name of the benefit income to apply a percentage to |
| `toeslag_percentage` | Percentage to apply to the named benefit income |

Variables are sticky: once set, they carry over to subsequent blocks unless explicitly overridden.

### Entry Point

`base-header.html` is pasted into the Qualtrics survey header. It loads `toeslagen.js` once and registers two hooks per block:

```javascript
Qualtrics.SurveyEngine.addOnReady(function() {
    window.toeslagen.runOnNewSlide(
        '${e://Field/sheet_url}',
        '${e://Field/sheet_name}',
        '${e://Field/enable_previous_button}',
        '${e://Field/start_saldo}',
        '${e://Field/month}',
        '${e://Field/toeslag_naam}',
        '${e://Field/toeslag_percentage}'
    );
});
Qualtrics.SurveyEngine.addOnPageSubmit(function(type) {
    if (type === "prev") { window.toeslagen.runOnPreviousButton(); }
});
```

### Public API (`window.toeslagen`)

| Method | Description |
|---|---|
| `runOnNewSlide(sheetUrl, sheetName, enablePrevious, startSaldo, month, toeslagNaam, toeslagPct)` | Called on every slide load; initialises data and updates UI |
| `applyIncomes()` | Apply this month's incomes to the saldo |
| `applyFixedExpenses()` | Apply this month's fixed expenses |
| `applyVariableExpense()` | Apply the next variable expense in sequence |
| `applyCustomExpense(amount)` | Apply a custom expense amount |
| `getVariableExpense()` | Retrieve the next variable expense without applying it |
| `getMonths()` | Access all loaded month data |
| `runOnPreviousButton()` | Handle backward navigation |

### Data Flow

1. First slide with a `sheet_url` triggers `SheetService` to fetch and parse the Excel file
2. `SimulationManager` activates the correct month and applies toeslag settings
3. `addOnPageSubmit` hooks call `applyIncomes()` / `applyFixedExpenses()` / `applyVariableExpense()` when the user clicks Next
4. `UIManager` updates the progress bar, saldo display, and question text variables after each transition

## Excel Data Format

One sheet = one scenario. Fixed column layout:

| Column | Content |
|---|---|
| A | Month name (new month starts when non-empty) |
| B | Income name |
| C | Income amount |
| D | Fixed expense name |
| E | Fixed expense amount |
| F | Variable expense name |
| G | Variable expense description |
| H | Variable expense amount |

Multiple rows per month are supported for multiple transactions of the same type.

## Local Test Environment

`test-env/` is a browser-based Qualtrics simulator:

- **`mock-qualtrics.js`** — simulates embedded variable state and `SurveyEngine` hooks
- **`blocks.js`** — defines the survey blocks with their embedded variable values

It mirrors the production Qualtrics flow without requiring a live survey. Start with `make test-env`.
