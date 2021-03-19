import mysqlp from 'mysql2/promise';
import DatabaseService from '../../../src/infrastructure/databaseService';

describe('Database Service', () => {
  it('should get the connection secret from the secrets manager', async () => {
    const mockSecretsManager = { getSecret: jest.fn().mockResolvedValue('secret') };
    const mockMysql = ({
      createConnection: jest.fn().mockResolvedValue({ execute: jest.fn() }),
    } as unknown) as typeof mysqlp;

    const dbService = new DatabaseService(mockSecretsManager, mockMysql);

    await dbService.get('sdfsdf', ['']);

    expect(mockSecretsManager.getSecret).toHaveBeenCalledTimes(1);
  });

  it('returns the response from executing the DB query', async () => {
    const mockSecretsManager = { getSecret: jest.fn().mockResolvedValue('secret') };
    const mockMysql = ({
      createConnection: jest.fn().mockResolvedValue({ execute: jest.fn().mockReturnValue('Success') }),
    } as unknown) as typeof mysqlp;

    const dbService = new DatabaseService(mockSecretsManager, mockMysql);

    const response = await dbService.get('sdfsdf', ['']);

    expect(response).toEqual('Success');
  });
});
