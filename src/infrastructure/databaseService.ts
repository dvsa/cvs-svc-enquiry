import mysqlp, { FieldPacket, RowDataPacket, Connection } from 'mysql2/promise';
import SecretsManagerServiceInterface from '../interfaces/SecretsManagerService';
import DatabaseServiceInterface from '../interfaces/DatabaseService';

export default class DatabaseService implements DatabaseServiceInterface {
  connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async get(query: string, params: string[] | undefined): Promise<[RowDataPacket[], FieldPacket[]]> {
    try {
      console.info(`Executing query ${query} with params ${params.join(', ')}`);
      const result = await this.connection.execute<RowDataPacket[]>(query, params);

      return result;
    } catch (e) {
      // Type checking because the type of e can't be specified in the params
      if (e instanceof Error) {
        e.message = `Database error: ${e.message}`;
      }

      throw e;
    }
  }

  public static async build(
    secretsManager: SecretsManagerServiceInterface,
    mysql: typeof mysqlp,
  ): Promise<DatabaseServiceInterface> {
    const dbConnectionDetailsString = await secretsManager.getSecret(process.env.SECRET);
    const dbConnectionDetails = JSON.parse(dbConnectionDetailsString) as StoredConnectionDetails;
    const connection = await mysql.createConnection({
      user: dbConnectionDetails.username,
      password: dbConnectionDetails.password,
      host: dbConnectionDetails.host,
      port: dbConnectionDetails.port,
      database: process.env.SCHEMA_NAME,
    });

    return new DatabaseService(connection);
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
