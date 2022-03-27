import { Request, Response } from '../protocol/http';
import MissingParamException from '../exception/missing-param.exception';
import badRequest from '../helper/BadRequest';
import Controller from '../protocol/controller';

class SignupController implements Controller {
  public handle(request : Request): Response {
    const requireFields: string[] = ['name', 'email', 'password', 'password_confirmation'];
    const hasError: string | undefined = requireFields
      .find((field: string) => !request.body[field]);

    if (hasError) {
      return badRequest(new MissingParamException(hasError));
    }

    return {
      statusCode: 200,
      body: request.body,
    };
  }
}

export default SignupController;
