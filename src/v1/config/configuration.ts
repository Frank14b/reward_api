import * as process from 'process';

export interface DatabaseConfig {
  uri: string;
  dbName: string;
  user?: string;
  pass?: string;
}

export default () => {
  return {
    port: parseInt(process.env.PORT) || 3000,
    database: {
      uri: process.env.MONGO_DB_URI,
      dbName: process.env.MONGO_DB_NAME,
      user: process.env.MONGO_DB_USER,
      password: process.env.MONGO_DB_PASS,
    } as DatabaseConfig,
    gracefulShutdownTimeout:
      parseInt(process.env.GRACEFUL_SHUTDOWN_TIMEOUT, 10) || 5000,
  };
};
