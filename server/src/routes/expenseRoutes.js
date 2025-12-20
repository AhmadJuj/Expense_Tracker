import express from 'express';
import {
  getAllExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
} from '../controllers/expenseController.js';

const router = express.Router();

router.route('/')
  .get(getAllExpenses)
  .post(createExpense);

router.route('/stats')
  .get(getExpenseStats);

router.route('/:id')
  .get(getExpense)
  .put(updateExpense)
  .delete(deleteExpense);

export default router;
