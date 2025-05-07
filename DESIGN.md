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
     - Tracks slide history with slide change stack
     - Provides navigation controls (previous/next slide)

3. **Domain Layer**
   - **SaldoSimulation**: Core business logic for financial calculations
   - **Models**:
     - `Month`: Represents a financial month
     - `Income`: Income transaction model with percentage adjustment capability
     - `Expense`: Expense transaction model

4. **Infrastructure Layer**
   - **CSVService**: Handles data loading and parsing
     - Fetches CSV data from external sources
     - Converts CSV data to domain objects

5. **Presentation Layer**
   - **UIManager**: Handles all UI-related operations
     - Updates progress bars
     - Manages loading states
     - Updates financial amounts display with animations
     - Handles question text variables with dynamic content replacement
     - Controls navigation button visibility

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
- `getVariableExpense()` - For retrieving expense information without applying it
- `getMonths()` - For accessing month data
- `runOnPreviousButton()` - For handling backward navigation

### Data Flow
1. CSV data is loaded containing financial scenarios
2. User progresses through Qualtrics survey
3. Each page transition triggers relevant simulation updates
4. UI reflects current financial state and progress
5. Navigation controls allow forward and backward movement through the simulation

## Technical Implementation

### State Management
- Centralized state management in `SimulationManager`
- Tracks:
  - Current and previous saldo (balance)
  - Current month
  - Toeslag settings (name and percentage)
  - Simulation initialization status
  - Slide number and change history
  - Original starting saldo

### Data Model
- Structured around monthly financial periods
- Supports multiple types of financial transactions:
  - Regular income
  - Benefits (toeslagen) with adjustable percentages
  - Fixed expenses
  - Variable expenses with sequential processing
  - Custom expenses

### UI Components
- Progress visualization with month indicators
- Financial amount display with smooth animations
- Loading states for asynchronous operations
- Navigation controls with conditional visibility
- Dynamic text replacement for question variables

### Animation and Transitions
- Smooth saldo amount transitions with requestAnimationFrame
- Visual progress indicator for month progression
- Conditional display of UI elements based on simulation state

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
