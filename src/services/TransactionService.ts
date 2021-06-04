// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDto {
  transactions: Transaction[];
  balance: Balance;
}

class CreateTransactionService {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public async getTransactions(): Promise<TransactionDto> {
    const transactionRepository = getRepository(Transaction);
    this.transactions = await transactionRepository.find({
      relations: ['category'],
    });
    // this.transactions.push(...transactions);
    const balance = this.getBalance();
    const transactionDto = {
      transactions: this.transactions,
      balance,
    };
    return transactionDto;
  }

  public getBalance(): Balance {
    const reducer = (accumulator: number, currentValue: number): number =>
      accumulator + currentValue;

    const somaIncome = this.transactions
      .filter(transaction => transaction.type === 'income')
      .map(item => Number(item.value))
      .reduce(reducer, 0);

    const somaOutcome = this.transactions
      .filter(transaction => transaction.type === 'outcome')
      .map(item => Number(item.value))
      .reduce(reducer, 0);

    const balance = {
      income: somaIncome,
      outcome: somaOutcome,
      total: somaIncome - somaOutcome,
    };

    return balance;
  }
}

export default CreateTransactionService;
