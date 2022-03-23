import { Request, Response } from '../protocol/http';

class SignupController {
  public handle(request : Request): Response {
    if (!request.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name'),
      };
    }

    if (!request.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email'),
      };
    }

    return {
      statusCode: 200,
      body: request.body,
    };
  }
}

export default SignupController;
