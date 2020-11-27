export class Error403 extends Error {
  constructor(message, status, tilgang = {}) {
    super(message);
    this.status = status;
    this.tilgang = tilgang;
  }
}
