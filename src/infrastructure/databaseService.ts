import mysqlp, { FieldPacket, RowDataPacket } from 'mysql2/promise';
import SecretsManagerServiceInterface from '../interfaces/SecretsManagerService';
import DatabaseServiceInterface from '../interfaces/DatabaseService';

export default class DatabaseService implements DatabaseServiceInterface {
  getDb: (query: string, params: string[] | undefined) => Promise<[RowDataPacket[], FieldPacket[]]>;

  constructor(getDb: (query: string, params: string[] | undefined) => Promise<[RowDataPacket[], FieldPacket[]]>) {
    this.getDb = getDb;
  }

  async get(query: string, params: string[] | undefined): Promise<[RowDataPacket[], FieldPacket[]]> {
    try {
      console.info(`Executing query ${query} with params ${params.join(', ')}`);
      const result = await this.getDb(query, params);

      return result;
    } catch (e) {
      // Type checking because the type of e can't be specified in the params
      if (e instanceof Error) {
        e.message = `Database error: ${e.message}`;
      }

      throw e;
    }
  }

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
      });
    }

    // eslint-disable-next-line @typescript-eslint/unbound-method
    return new DatabaseService(this.pool.query);
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
