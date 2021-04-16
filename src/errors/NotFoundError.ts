export default class NotFoundError extends Error {
  constructor() {
    super();
    this.message = 'Vehicle not found';
  }
}
