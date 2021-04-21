import { SecretsManager } from 'aws-sdk';
import MissingSecretError from '../errors/MissingSecretError';
import SecretsManagerServiceInterface from '../interfaces/SecretsManagerService';

export default class SecretsManagerService implements SecretsManagerServiceInterface {
  secretsManager: SecretsManager;

  constructor(secretsManager: SecretsManager) {
    this.secretsManager = secretsManager;
  }

  async getSecret(secretName: string): Promise<string> {
    const data = await this.secretsManager.getSecretValue({ SecretId: secretName }).promise();

    if (data.SecretString) {
      return data.SecretString;
    }
    if (data.SecretBinary) {
      return data.SecretBinary.toString('utf-8');
    }

    throw new MissingSecretError();
  }
}
