class ServerException extends Error {
  constructor() {
    super('Internal server error');
    this.name = 'ServerException';
  }
}

export default ServerException;
