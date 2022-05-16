import { SecretsManager } from 'aws-sdk';
import MissingSecretError from '../../../src/errors/MissingSecretError';
import SecretsManagerService from '../../../src/infrastructure/secretsManagerService';

describe('Secrets service', () => {
  it('throws an error if getSecretValue fails', async () => {
    const mockSecretsManager = ({} as unknown) as SecretsManager;
    const service = new SecretsManagerService(mockSecretsManager);

    mockSecretsManager.getSecretValue = jest.fn().mockImplementation(() => {
      throw new Error('Error');
    });

    await expect(service.getSecret(undefined)).rejects.toThrow(Error);
  });

  it('throws an error when the secretName is undefined', async () => {
    const mockSecretsManager = ({} as unknown) as SecretsManager;
    const service = new SecretsManagerService(mockSecretsManager);

    await expect(service.getSecret(undefined)).rejects.toThrow(Error);
  });

  it('should return the secret string', async () => {
    const secretValue = 'this is a secret';
    const mockSecretsManager = ({} as unknown) as SecretsManager;
    const mockPromise = Promise.resolve({ SecretString: secretValue });
    const mockPromiseFunc = jest.fn().mockReturnValue(mockPromise);
    const service = new SecretsManagerService(mockSecretsManager);

    mockSecretsManager.getSecretValue = jest.fn().mockReturnValue({ promise: mockPromiseFunc });

    expect(await service.getSecret('secret')).toEqual('this is a secret');
  });

  it('should convert a binary secret to a string', async () => {
    const secretValue = Buffer.from('this is a secret');
    const mockSecretsManager = ({} as unknown) as SecretsManager;
    const mockPromise = Promise.resolve({ SecretBinary: secretValue });
    const mockPromiseFunc = jest.fn().mockReturnValue(mockPromise);
    const service = new SecretsManagerService(mockSecretsManager);

    mockSecretsManager.getSecretValue = jest.fn().mockReturnValue({ promise: mockPromiseFunc });

    expect(await service.getSecret('secret')).toEqual('this is a secret');
  });

  it('should throw if there is no secret available in the response from the secret manager', async () => {
    const mockSecretsManager = ({} as unknown) as SecretsManager;
    const mockPromise = Promise.resolve({});
    const mockPromiseFunc = jest.fn().mockReturnValue(mockPromise);
    const service = new SecretsManagerService(mockSecretsManager);

    mockSecretsManager.getSecretValue = jest.fn().mockReturnValue({ promise: mockPromiseFunc });

    await expect(service.getSecret('secret')).rejects.toThrow(MissingSecretError);
  });
});
