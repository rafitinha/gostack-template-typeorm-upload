import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import csvParse from 'csv-parse';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import CreateCategoryService from './CreateCategoryService';

// import AppError from '../errors/AppError';

import uploadConfig from '../config/upload';

class ImportTransactionsService {
  public async execute(cvsFileName: string): Promise<string> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    /*
    const transactionFilePath = path.join(uploadConfig.directory, cvsFileName);
    const transactionFileExists = await fs.promises.stat(transactionFilePath);

    if (transactionFileExists) {
      await fs.promises.unlink(transactionFilePath);
    }
    */
    const transactionArray: Transaction[] = await this.loadCSV(cvsFileName);

    transactionArray.forEach(async (item: Transaction, i) => {
      console.log(`[${i}] : ${item.title}`);

      const categoryEntity = await new CreateCategoryService().execute(
        item.category,
      );

      const transaction = transactionRepository.create({
        title: item.title,
        value: item.value,
        type: item.type,
        category: categoryEntity,
      });

      await transactionRepository.save(transaction);
    });

    return 'ok';
  }

  public async loadCSV(fileName: string): Promise<Transaction[]> {
    const csvFilePath = path.resolve(
      __dirname,
      '..',
      '..',
      'tmp',
      `${fileName}`,
    );
    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: Array<Transaction> = [];

    parseCSV.on('data', line => {
      const [title, type, value, category] = line;
      const transaction = new Transaction();
      const categoryEntity = new Category();
      categoryEntity.title = category;

      transaction.title = title;
      transaction.type = type;
      transaction.value = value;
      transaction.category = categoryEntity;
      lines.push(transaction);
      // lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return lines;
  }
}

export default ImportTransactionsService;
