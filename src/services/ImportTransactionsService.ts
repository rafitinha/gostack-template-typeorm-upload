// import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
// import csvParse from 'csv-parse';
// import Transaction from '../models/Transaction';

// import AppError from '../errors/AppError';

import uploadConfig from '../config/upload';

class ImportTransactionsService {
  public async execute(cvsFileName: string): Promise<string> {
    // const transactionRepository = getRepository(Transaction);

    const transactionFilePath = path.join(uploadConfig.directory, cvsFileName);
    const transactionFileExists = await fs.promises.stat(transactionFilePath);

    if (transactionFileExists) {
      await fs.promises.unlink(transactionFilePath);
    }

    return 'ok';
  }
}

export default ImportTransactionsService;
