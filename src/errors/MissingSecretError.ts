export default class MissingSecretError extends Error {
  constructor() {
    super();
    this.message = 'Secret missing from S3 response';
  }
}
