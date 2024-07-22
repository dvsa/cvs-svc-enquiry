export default interface SecretsManagerService {
  getSecret(secretName: string): Promise<string>;
}
