import { Request, Response } from '../protocol/http';
import MissingParamException from '../exception/missing-param.exception';

class SignupController {
  public handle(request : Request): Response {
    if (!request.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamException('name'),
      };
    }

    if (!request.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamException('email'),
      };
    }

    return {
      statusCode: 200,
      body: request.body,
    };
  }
}

export default SignupController;
