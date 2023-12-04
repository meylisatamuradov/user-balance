import * as Yup from "yup";
import {
ValidationError,
NotFoundError,
} from "../utils/ApiError";
import User from "../models/User";
import { sequelize } from "../services/sequelize.service";
import { Sequelize } from "sequelize";
//Yup is a JavaScript schema builder for value parsing and validation.

const userController = {
  update: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        amount: Yup.number().required(),
        id: Yup.number().required(),
      });

      if (!(await schema.isValid(req.body))) throw new ValidationError();

      await sequelize.transaction({
        isolationLevel: Sequelize.Transaction.SERIALIZABLE
      }, async (t) => {
        const user = await User.findOne({where: {id: req.body.id }, lock: true, transaction: t });
 
        if(!user) throw new NotFoundError('User not found')
    
        const newBalance = user.balance + req.body.amount;
    
        if(newBalance < 0) throw new NotFoundError('User balance not enough');

        const newUser = await user.update({balance: newBalance}, { transaction: t })
        
        return res.status(200).json(newUser.dataValues);
    });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
