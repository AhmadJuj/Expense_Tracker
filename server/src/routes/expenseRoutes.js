const express = require('express');
const router = express.Router();
const {
  getAllExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
} = require('../controllers/expenseController');

router.route('/')
  .get(getAllExpenses)
  .post(createExpense);

router.route('/stats')
  .get(getExpenseStats);

router.route('/:id')
  .get(getExpense)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
