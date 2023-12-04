import { Sequelize } from "sequelize";
import databaseConfig from "../config/database";
import fs from "fs";
import { Umzug, SequelizeStorage }  from "umzug";

const modelFiles = fs
  .readdirSync(__dirname + "/../models/")
  .filter((file) => file.endsWith(".js"));
  
const sequelize = new Sequelize(databaseConfig);

const sequelizeService = {
  init: async () => {
    try {
      const umzug = new Umzug({
        migrations: { glob: 'src/database/migrations/*.js' },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: console,
      });

      /*
        Loading models automatically
      */
     
      for (const file of modelFiles) {
        const model = await import(`../models/${file}`);
        model.default.init(sequelize);
      }

      modelFiles.map(async (file) => {
        const model = await import(`../models/${file}`);
        model.default.associate && model.default.associate(sequelize.models);
      });

      await umzug.up();
  
      console.log("[SEQUELIZE] Database service initialized");
    } catch (error) {
      console.log("[SEQUELIZE] Error during database service initialization");
      throw error;
    }
  },
};

module.exports = { sequelizeService, sequelize };
