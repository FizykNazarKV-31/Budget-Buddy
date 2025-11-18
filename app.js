
class Transaction {
    constructor(amount, type, category) {
        this.id = Date.now(); 
        this.amount = parseFloat(amount);
        this.type = type; 
        this.category = category || 'Інше';
        this.date = new Date().toLocaleString();
    }
}

class TransactionRepository {
    constructor() {
        this.storageKey = 'budget_buddy_data';
    }

    getAll() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    save(transaction) {
        const transactions = this.getAll();
        transactions.push(transaction);
        localStorage.setItem(this.storageKey, JSON.stringify(transactions));
    }
}

class BudgetManager {
    constructor() {
        this.repository = new TransactionRepository();
    }

    addTransaction(amount, type, category) {
        if (isNaN(amount) || amount <= 0) {
            alert("Введіть коректну суму!");
            return;
        }
        const transaction = new Transaction(amount, type, category);
        this.repository.save(transaction);
        return transaction;
    }

    calculateBalance() {
        const transactions = this.repository.getAll();
        return transactions.reduce((total, t) => {
            return t.type === 'income' ? total + t.amount : total - t.amount;
        }, 0);
    }

    getHistory() {
        return this.repository.getAll().reverse();
    }
}

class UIDashboard {
    constructor() {
        this.manager = new BudgetManager();
        this.balanceEl = document.getElementById('total-balance');
        this.listEl = document.getElementById('transaction-list');
        
        this.amountInput = document.getElementById('amount-input');
        this.categoryInput = document.getElementById('category-input');

        this.initListeners();
        this.updateDisplay();
    }

    initListeners() {
        document.getElementById('add-income-btn').addEventListener('click', () => {
            this.handleAdd('income');
        });

        document.getElementById('add-expense-btn').addEventListener('click', () => {
            this.handleAdd('expense');
        });
    }

    handleAdd(type) {
        const amount = this.amountInput.value;
        const category = this.categoryInput.value;
        
        this.manager.addTransaction(amount, type, category);
        
        this.amountInput.value = '';
        this.categoryInput.value = '';
        
        this.updateDisplay();
    }

    updateDisplay() {
        this.balanceEl.textContent = `${this.manager.calculateBalance()} ₴`;
        
        this.listEl.innerHTML = '';
        const history = this.manager.getHistory();
        
        history.forEach(t => {
            const li = document.createElement('li');
            li.textContent = `${t.date} | ${t.type === 'income' ? '+' : '-'} ${t.amount} ₴ (${t.category})`;
            li.style.color = t.type === 'income' ? 'green' : 'red';
            this.listEl.appendChild(li);
        });
    }
}

const app = new UIDashboard();