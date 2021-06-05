import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: Category;
}
interface Balance {
  income: number;
  outcome: number;
  total: number;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    /*
    const categoryRepository = getRepository(Category);

    let categoryEntity = await categoryRepository.findOne({
      where: { title: category.title },
    });

    if (!categoryEntity) {
      const createCategory = categoryRepository.create(category);
      categoryEntity = await categoryRepository.save(createCategory);
    }
    */
    const transactionRepository = getRepository(Transaction);
    if (type === 'outcome') {
      await this.validaOutCome(value);
    }

    const categoryEntity = await new CreateCategoryService().execute(category);

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: categoryEntity,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }

  public async validaOutCome(outcome: number): Promise<Balance> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const balance = await transactionRepository.getBalance();

    if (outcome > balance.total) {
      throw new AppError('Erro', 400);
    }

    return balance;
    // https://medium.com/trainingcenter/entendendo-promises-de-uma-vez-por-todas-32442ec725c2
    /*
    await transactionRepository
      .getBalance()
      .then((res: Balance) => {
        const { total } = res;
        console.log(total);
        if (outcome > total) {
          throw new AppError('Erro', 400);
        }
      })
      .catch(() => {
        throw new AppError('Erro', 400);
      });
      */
  }
}

export default CreateTransactionService;
