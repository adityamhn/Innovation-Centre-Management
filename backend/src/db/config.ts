export const db = {
    user: process.env.POSTGRESDB_USER || "postgres",
    password: process.env.POSTGRESDB_ROOT_PASSWORD || "postgres",
    host: process.env.POSTGRESDB_HOST || "localhost",
    port: process.env.POSTGRESDB_LOCAL_PORT || 5433,
    database: process.env.POSTGRESDB_DATABASE || "ic_db",
  };
  
  export const port = process.env.PORT || 8080;