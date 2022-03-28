import { Request, Response } from './http';

interface Controller {
  handle(request: Request): Response | Promise<Response>;
}

export default Controller;
