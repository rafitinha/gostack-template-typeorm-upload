// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: Category;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);
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
}

export default CreateTransactionService;
