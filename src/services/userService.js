import { sequelize } from '../config/database.js';

export class UserService {
  static async updateBalance(userId, amount) {
    const result = await sequelize.query(
      `UPDATE users 
       SET balance = balance + :amount 
       WHERE id = :userId AND balance + :amount >= 0 
       RETURNING balance`,
      {
        replacements: { userId, amount },
        type: sequelize.QueryTypes.UPDATE
      }
    );

    if (!result[0].length) {
      throw new Error('Insufficient balance or user not found');
    }

    return result[0][0];
  }
}