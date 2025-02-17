import { check } from 'express-validator';

export const updateBalanceValidator = [
  check('userId').isInt().withMessage('User ID must be an integer'),
  check('amount').isFloat().withMessage('Amount must be a number')
];