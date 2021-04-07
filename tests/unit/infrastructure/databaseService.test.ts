import mysqlp from 'mysql2/promise';
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

    const dbService = new DatabaseService(mockSecretsManager, mockMysql);

    await expect(dbService.get('sdfsdf', [''])).rejects.toThrow(Error);
  });

  it('should throw an error when the query fails', async () => {
    const mockSecretsManager = {
      getSecret: jest.fn().mockResolvedValueOnce(JSON.stringify(connectionDetails)).mockResolvedValue('dbName'),
    };
    const mockMysql = ({
      createConnection: jest.fn().mockResolvedValue({ execute: jest.fn().mockRejectedValue(new Error()) }),
    } as unknown) as typeof mysqlp;

    const dbService = new DatabaseService(mockSecretsManager, mockMysql);

    await expect(dbService.get('sdfsdf', [''])).rejects.toThrow(Error);
  });

  it('should get the connection secret from the secrets manager', async () => {
    const mockSecretsManager = {
      getSecret: jest.fn().mockResolvedValueOnce(JSON.stringify(connectionDetails)).mockResolvedValue('dbName'),
    };
    const mockMysql = ({
      createConnection: jest.fn().mockResolvedValue({ execute: jest.fn() }),
    } as unknown) as typeof mysqlp;

    const dbService = new DatabaseService(mockSecretsManager, mockMysql);

    await dbService.get('sdfsdf', ['']);

    expect(mockSecretsManager.getSecret).toHaveBeenCalledTimes(1);
  });

  it('returns the response from executing the DB query', async () => {
    const mockSecretsManager = { getSecret: jest.fn().mockResolvedValue(JSON.stringify(connectionDetails)) };
    const mockMysql = ({
      createConnection: jest.fn().mockResolvedValue({ execute: jest.fn().mockReturnValue('Success') }),
    } as unknown) as typeof mysqlp;

    const dbService = new DatabaseService(mockSecretsManager, mockMysql);

    const response = await dbService.get('sdfsdf', ['']);

    expect(response).toEqual('Success');
  });
});
