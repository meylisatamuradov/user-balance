import express from 'express';
import { UserController } from '../controllers/userController.js';
import { updateBalanceValidator } from '../utils/validator.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

router.post('/balance/update',
  updateBalanceValidator,
  validateRequest,
  UserController.updateBalance
);

export default router;