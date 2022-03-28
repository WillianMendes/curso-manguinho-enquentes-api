import { AddAccount } from '../../domain/useCase/add-account';
import Controller from '../protocol';
import { Request, Response } from '../protocol/http';
import EmailValidator from '../protocol/validator';
import { InvalidParamException, MissingParamException } from '../exception';
import { badRequest, created, serverError } from '../helper/http-helper';

class SignupController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  public handle(request : Request): Response {
    try {
      const {
        name, email, password, passwordConfirmation,
      } = request.body;

      const requireFields: string[] = ['name', 'email', 'password', 'passwordConfirmation'];
      const invalidRequiredField: string | undefined = requireFields
        .find((field: string) => !request.body[field]);

      if (invalidRequiredField) return badRequest(new MissingParamException(invalidRequiredField));
      if (!this.emailValidator.isValid(email)) return badRequest(new InvalidParamException('email'));
      if (password !== passwordConfirmation) return badRequest(new InvalidParamException('passwordConfirmation'));

      const account = this.addAccount.add({ name, email, password });
      return created(account);
    } catch (error) {
      return serverError();
    }
  }
}

export default SignupController;
