export default class InvalidNumberplateError extends Error {
    constructor() {
      super();
      this.message = "Numberplate is invalid";
    }
  }
