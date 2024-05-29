export default class InvalidIdentifierError extends Error {
  constructor() {
    super();
    this.message = 'Vehicle identifier is invalid';
  }
}
