import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

// import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import TransactionService from '../services/TransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionService = new TransactionService();
  const transactions = await transactionService.getTransactions();

  response.json(transactions);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransactionService = new DeleteTransactionService();
  await deleteTransactionService.execute(id);
  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('import'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();
    const arrayTransactions = await importTransactionsService.execute(
      request.file.filename,
    );

    return response.json(arrayTransactions);
  },
);

export default transactionsRouter;
