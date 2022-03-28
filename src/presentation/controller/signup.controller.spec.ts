import AccountModel from '../../domain/model/account.model';
import { AddAccount, AddAccountModel } from '../../domain/useCase/add-account';
import SignupController from './signup.controller';
import { Request, Response } from '../protocol/http';
import EmailValidator from '../protocol/validator';
import { InvalidParamException, MissingParamException, ServerException } from '../exception';

interface SutTypes {
  sut: SignupController,
  emailValidatorStub: EmailValidator,
  addAccountStub: AddAccount
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      return {
        id: 'valid id',
        name: account.name,
        email: account.email,
        password: account.password,
      };
    }
  }
  return new AddAccountStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub();
  const addAccountStub = makeAddAccountStub();
  const sut = new SignupController(emailValidatorStub, addAccountStub);

  return { sut, emailValidatorStub, addAccountStub };
};

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut }: SutTypes = makeSut();

    const httpRequest: Request = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        password_confirmation: 'any_password',
      },
    };

    const httpResponse: Response = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamException('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const { sut }: SutTypes = makeSut();

    const httpRequest: Request = {
      body: {
        name: 'any name',
        password: 'any_password',
        password_confirmation: 'any_password',
      },
    };

    const httpResponse: Response = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamException('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const { sut }: SutTypes = makeSut();

    const httpRequest: Request = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password_confirmation: 'any_password',
      },
    };

    const httpResponse: Response = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamException('password'));
  });

  test('Should return 400 if no password confirmation is provided', () => {
    const { sut }: SutTypes = makeSut();

    const httpRequest: Request = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };

    const httpResponse: Response = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamException('passwordConfirmation'));
  });

  test('Should return 400 if password confirmation is fails', () => {
    const { sut }: SutTypes = makeSut();

    const httpRequest: Request = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password_confirmation',
      },
    };

    const httpResponse: Response = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamException('passwordConfirmation'));
  });

  test('Should return 400 if invalid email is provided', () => {
    const { sut, emailValidatorStub }: SutTypes = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest: Request = {
      body: {
        name: 'any name',
        email: 'invalid_email#email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse: Response = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamException('email'));
  });

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub }: SutTypes = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest: Request = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  test('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new ServerException();
    });

    const httpRequest: Request = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse: Response = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerException());
  });

  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub }: SutTypes = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');

    const httpRequest: Request = {
      body: {
        name: 'valid name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    };

    sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });
});
