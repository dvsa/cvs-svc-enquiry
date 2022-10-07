import mysqlp, { FieldPacket, RowDataPacket } from 'mysql2/promise';
import DatabaseService from '../../../src/infrastructure/databaseService';

describe('Database Service', () => {
  const connectionDetails = {
    username: 'username',
    password: 'password',
    engine: 'mysql',
    host: 'host',
    port: 1234,
    dbname: 'dbname',
    dbClusterIdentifier: 'cluster',
  };

  it('should throw an error when the connection fails', async () => {
    const mockSecretsManager = {
      getSecret: jest.fn().mockResolvedValueOnce(JSON.stringify(connectionDetails)).mockResolvedValue('dbName'),
    };
    const mockMysql = ({
      createConnection: jest.fn().mockRejectedValue(new Error('this is an error')),
    } as unknown) as typeof mysqlp;

    await expect(DatabaseService.build(mockSecretsManager, mockMysql)).rejects.toThrow(Error);
  });

  it('should throw an error when the query fails', async () => {
    const mockConnection = jest.fn().mockRejectedValue(new Error()) as (query:string, params:string[] | undefined)=>Promise<[RowDataPacket[], FieldPacket[]]>;
    const dbService = new DatabaseService(mockConnection);

    await expect(dbService.get('sdfsdf', [''])).rejects.toThrow(Error);
  });

  it('adds the expected prefix to the error', async () => {
    const mockConnection = jest.fn().mockRejectedValue(new Error()) as (query:string, params:string[] | undefined)=>Promise<[RowDataPacket[], FieldPacket[]]>;;
    const dbService = new DatabaseService(mockConnection);

    await expect(dbService.get('sdfsdf', [''])).rejects.toThrowError('Database error: ');
  });

  it('should get the connection secret from the secrets manager', async () => {
    const mockSecretsManager = {
      getSecret: jest.fn().mockResolvedValueOnce(JSON.stringify(connectionDetails)).mockResolvedValue('dbName'),
    };
    const mockMysql = ({
      createPool: jest.fn().mockResolvedValue({ execute: jest.fn() }),
    } as unknown) as typeof mysqlp;

    await DatabaseService.build(mockSecretsManager, mockMysql);

    expect(mockSecretsManager.getSecret).toHaveBeenCalledTimes(1);
  });

  it('returns the response from executing the DB query', async () => {
    const mockConnection = jest.fn().mockReturnValue('Success') as (query:string, params:string[] | undefined)=>Promise<[RowDataPacket[], FieldPacket[]]>;
    const dbService = new DatabaseService(mockConnection);
    const response = await dbService.get('sdfsdf', ['']);

    expect(response).toEqual('Success');
  });
});
