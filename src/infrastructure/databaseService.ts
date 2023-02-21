import mysqlp, { FieldPacket, RowDataPacket } from 'mysql2/promise';
import SecretsManagerServiceInterface from '../interfaces/SecretsManagerService';
import DatabaseServiceInterface from '../interfaces/DatabaseService';

export default class DatabaseService implements DatabaseServiceInterface {
  public constructor(pool: mysqlp.Pool) {
    this.pool = pool;
  }

  async get(query: string, params: string[] | undefined): Promise<[RowDataPacket[], FieldPacket[]]> {
    try {
      console.info(`Executing query ${query} with params ${params.join(', ')}`);
      const tempResult = await this.pool.query(query, params);
      return tempResult as [RowDataPacket[], FieldPacket[]];
    } catch (e) {
      // Type checking because the type of e can't be specified in the params
      if (e instanceof Error) {
        e.message = `Database error: ${e.message}`;
      }

      throw e;
    }
  }

  pool: mysqlp.Pool;

  static pool: mysqlp.Pool = undefined;

  public static async build(
    secretsManager: SecretsManagerServiceInterface,
    mysql: typeof mysqlp,
  ): Promise<DatabaseServiceInterface> {
    const dbConnectionDetailsString = await secretsManager.getSecret(process.env.SECRET);
    const dbConnectionDetails = JSON.parse(dbConnectionDetailsString) as StoredConnectionDetails;
    if (this.pool === undefined) {
      this.pool = mysql.createPool(<mysqlp.PoolOptions>{
        connectionLimit: 50,
        user: dbConnectionDetails.username,
        password: dbConnectionDetails.password,
        host: dbConnectionDetails.host,
        port: dbConnectionDetails.port,
        database: process.env.SCHEMA_NAME,
        multipleStatements: true,
      });
    }

    return new DatabaseService(this.pool);
  }
}

type StoredConnectionDetails = {
  username: string;
  password: string;
  engine: string;
  host: string;
  port: number;
  dbname: string;
  dbClusterIdentifier: string;
};
