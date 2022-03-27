import Controller from '../protocol';
import { Request, Response } from '../protocol/http';
import EmailValidator from '../protocol/validator';
import { InvalidParamException, MissingParamException } from '../exception';
import { badRequest, serverError } from '../helper/BadRequest';

class SignupController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  public handle(request : Request): Response {
    try {
      const { email, password, passwordConfirmation } = request.body;

      const requireFields: string[] = ['name', 'email', 'password', 'passwordConfirmation'];
      const invalidRequiredField: string | undefined = requireFields
        .find((field: string) => !request.body[field]);

      if (invalidRequiredField) return badRequest(new MissingParamException(invalidRequiredField));
      if (!this.emailValidator.isValid(email)) return badRequest(new InvalidParamException('email'));
      if (password !== passwordConfirmation) return badRequest(new InvalidParamException('passwordConfirmation'));

      return {
        statusCode: 200,
        body: request.body,
      };
    } catch (error) {
      return serverError();
    }
  }
}

export default SignupController;
