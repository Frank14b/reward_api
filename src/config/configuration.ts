export interface DatabaseConfig {
  uri: string;
  dbName: string;
  user?: string;
  pass?: string;
}

export default () => {
  return {
    database: {
      uri: process.env.MONGO_DB_URI,
      dbName: process.env.MONGO_DB_NAME,
      user: process.env.MONGO_DB_USER,
      password: process.env.MONGO_DB_PASS,
    } as DatabaseConfig,
  };
};
