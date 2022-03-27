import Controller from '../protocol/controller';
import EmailValidator from '../protocol/email.validator';
import { Request, Response } from '../protocol/http';
import { InvalidParamException, MissingParamException } from '../exception';
import { badRequest, serverError } from '../helper/BadRequest';

class SignupController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  public handle(request : Request): Response {
    try {
      const { email } = request.body;

      const requireFields: string[] = ['name', 'email', 'password', 'password_confirmation'];
      const invalidRequiredField: string | undefined = requireFields
        .find((field: string) => !request.body[field]);

      if (invalidRequiredField) {
        return badRequest(new MissingParamException(invalidRequiredField));
      }

      const emailIsValid: boolean = this.emailValidator.isValid(email);
      if (!emailIsValid) {
        return badRequest(new InvalidParamException('email'));
      }

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
