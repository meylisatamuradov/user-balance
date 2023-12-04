import Sequelize, { Model } from "sequelize";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        balance: Sequelize.INTEGER,
      },
      {
        sequelize,
        timestamps: true,
      }
    );

    return this;
  }
}

export default User;