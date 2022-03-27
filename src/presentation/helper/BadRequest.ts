import { Response } from '../protocol/http';
import ServerException from '../exception/server.exception';

const badRequest = (error: Error): Response => ({
  statusCode: 400,
  body: error,
});

const serverError = (): Response => ({
  statusCode: 500,
  body: new ServerException(),
});

export { badRequest, serverError };
