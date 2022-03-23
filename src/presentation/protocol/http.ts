interface Request {
  body?: any;
}

interface Response {
  body: any;
  statusCode: number;
}

export { Request, Response };
