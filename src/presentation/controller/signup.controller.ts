import { Request, Response } from '../protocol/http';
import MissingParamException from '../exception/missing-param.exception';
import badRequest from '../helper/BadRequest';

class SignupController {
  public handle(request : Request): Response {
    if (!request.body.name) {
      return badRequest(new MissingParamException('name'));
    }

    if (!request.body.email) {
      return badRequest(new MissingParamException('email'));
    }

    return {
      statusCode: 200,
      body: request.body,
    };
  }
}

export default SignupController;
