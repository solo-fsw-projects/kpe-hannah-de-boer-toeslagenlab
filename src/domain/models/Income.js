export class Income {
    constructor(name, amount) {
        this.name = name;
        this.amount = parseInt(amount);
        this.percentage = 100;
    }

    getOriginalAmount() {
        return this.amount;
    }

    getAmount() {
        return Math.round(this.amount * (this.percentage / 100));
    }

    getName() {
        return this.name;
    }

    setPercentage(percentage) {
        this.percentage = percentage;
    }
}
