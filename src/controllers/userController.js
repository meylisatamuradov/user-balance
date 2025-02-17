import { UserService } from '../services/userService.js';

export class UserController {
  static async updateBalance(req, res, next) {
    try {
      const { userId, amount } = req.body;
      const result = await UserService.updateBalance(userId, parseFloat(amount));
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}