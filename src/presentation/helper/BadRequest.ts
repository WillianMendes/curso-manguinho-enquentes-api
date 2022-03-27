import { Response } from '../protocol/http';

const badRequest = (error: Error): Response => ({
  statusCode: 400,
  body: error,
});

export default badRequest;
