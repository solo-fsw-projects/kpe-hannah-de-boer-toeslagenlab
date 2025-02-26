# Toeslagen Application Design Document

## Overview
The Toeslagen application is a web-based simulation tool designed to help users understand and interact with Dutch benefits (toeslagen) scenarios. It's primarily integrated with Qualtrics for research purposes and provides interactive financial simulations.

## Architecture

### Core Components

1. **Main Application (`toeslagen.js`)**
   - Entry point of the application
   - Manages global state and initialization
   - Exposes public API for Qualtrics integration
   - Coordinates between simulation and UI components

2. **Application Layer**
   - **SimulationManager**: Orchestrates the simulation process
     - Manages simulation state
     - Handles initialization from CSV data
     - Processes financial transactions (incomes, expenses)
     - Manages toeslag (benefit) settings and percentages

3. **Domain Layer**
   - **SaldoSimulation**: Core business logic for financial calculations
   - **Models**:
     - `Month`: Represents a financial month
     - `Income`: Income transaction model
     - `Expense`: Expense transaction model

4. **Infrastructure Layer**
   - **CSVService**: Handles data loading and parsing
     - Fetches CSV data from external sources
     - Converts CSV data to domain objects

5. **Presentation Layer**
   - **UIManager**: Handles all UI-related operations
     - Updates progress bars
     - Manages loading states
     - Updates financial amounts display
     - Handles question text variables

## Integration

### Qualtrics Integration
The application is designed to be embedded within Qualtrics surveys with three main dynamic blocks:
1. Income Block
2. Fixed Expenses Block
3. Variable Expenses Block

Each block includes specific JavaScript hooks for data synchronization:
- `applyIncomes()`
- `applyFixedExpenses()`
- `applyVariableExpense()`
- `applyCustomExpense()`

### Data Flow
1. CSV data is loaded containing financial scenarios
2. User progresses through Qualtrics survey
3. Each page transition triggers relevant simulation updates
4. UI reflects current financial state and progress

## Technical Implementation

### State Management
- Centralized state management in `SimulationManager`
- Tracks:
  - Current and previous saldo (balance)
  - Current month
  - Toeslag settings (name and percentage)
  - Simulation initialization status

### Data Model
- Structured around monthly financial periods
- Supports multiple types of financial transactions:
  - Regular income
  - Benefits (toeslagen)
  - Fixed expenses
  - Variable expenses
  - Custom expenses

### UI Components
- Progress visualization
- Financial amount display
- Loading states
- Navigation controls

## Deployment
- CSS and JS files are deployed to a subdirectory structure
- Version management through subdirectories (currently on v2)
- Local development uses a build directory with version-specific symlinks

## Testing
The application includes a comprehensive test suite:
- Unit tests for all core components
- Functional tests for end-to-end scenarios
- Mock implementations for external dependencies

## Usage Instructions
Detailed instructions for researchers are maintained in a separate Google Document:
"Instructie Dienst Toeslagen Onderzoek"
