import { SecretsManager } from '@aws-sdk/client-secrets-manager';
import MissingSecretError from '../errors/MissingSecretError';
import SecretsManagerServiceInterface from '../interfaces/SecretsManagerService';

export default class SecretsManagerService implements SecretsManagerServiceInterface {
  secretsManager: SecretsManager;

  constructor(secretsManager: SecretsManager) {
    this.secretsManager = secretsManager;
  }

  async getSecret(secretName: string): Promise<string> {
    const data = await this.secretsManager.getSecretValue({ SecretId: secretName });

    if (data.SecretString) {
      return data.SecretString;
    }
    if (data.SecretBinary) {
      return Buffer.from(data.SecretBinary).toString();
    }

    throw new MissingSecretError();
  }
}
