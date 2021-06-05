import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions: Transaction[] = await this.find();

    const reducer = (accumulator: number, currentValue: number): number =>
      accumulator + currentValue;

    const somaIncome = transactions
      .filter(transaction => transaction.type === 'income')
      .map(item => Number(item.value))
      .reduce(reducer, 0);

    const somaOutcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .map(item => Number(item.value))
      .reduce(reducer, 0);

    const balance: Balance = {
      income: somaIncome,
      outcome: somaOutcome,
      total: somaIncome - somaOutcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
