import { Umzug, SequelizeStorage } from 'umzug';
import { sequelize } from '../config/database.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const umzug = new Umzug({
  migrations: {
    glob: ['*.js', { cwd: __dirname, ignore: ['index.js'] }],
    resolve: params => {
      const getModule = () => import(`file://${params.path}`);
      return {
        name: params.name,
        path: params.path,
        up: async () => {
          const module = await getModule();
          return module.up({ context: sequelize.getQueryInterface() });
        },
        down: async () => {
          const module = await getModule();
          return module.down({ context: sequelize.getQueryInterface() });
        },
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

// Function to run migrations
async function runMigrations() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    
    const pending = await umzug.pending();
    console.log('Pending migrations:', pending.length);
    
    const migrations = await umzug.up();
    console.log('Migrations executed:', migrations.map(m => m.name));
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations();
}