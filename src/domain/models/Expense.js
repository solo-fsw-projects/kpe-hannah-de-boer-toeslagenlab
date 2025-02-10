export class Expense {
    constructor(name, description, amount) {
        this.name = name;
        this.description = description;
        this.amount = parseInt(amount);
    }

    getAmount() {
        return this.amount;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }
}
