import { Request, Response } from './http';

interface Controller {
  handle(request: Request): Response;
}

export default Controller;
