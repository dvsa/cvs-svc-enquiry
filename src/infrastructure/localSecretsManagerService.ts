import SecretsManagerServiceInterface from '../interfaces/SecretsManagerService';
import {
  databaseName, rootPassword, rootUsername, port,
} from '../resources/localDatabase';

export default class LocalSecretsManagerService implements SecretsManagerServiceInterface {
  async getSecret(): Promise<string> {
    return Promise.resolve(
      JSON.stringify({
        username: `${rootUsername}`,
        password: `${rootPassword}`,
        engine: 'mysql',
        host: '127.0.0.1',
        port: `${port}`,
        dbname: `${databaseName}`,
      }),
    );
  }
}
