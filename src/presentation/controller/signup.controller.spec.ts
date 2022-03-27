import SignupController from './signup.controller';
import EmailValidator from '../protocol/email.validator';
import { Request, Response } from '../protocol/http';
import { InvalidParamException, MissingParamException, ServerException } from '../exception';

interface SutTypes {
  sut: SignupController,
  emailValidatorStub: EmailValidator,
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignupController(emailValidatorStub);

  return { sut, emailValidatorStub };
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
    expect(httpResponse.body).toEqual(new MissingParamException('password_confirmation'));
  });

  test('Should return 400 if invalid email is provided', () => {
    const { sut, emailValidatorStub }: SutTypes = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest: Request = {
      body: {
        name: 'any name',
        email: 'invalid_email#email.com',
        password: 'any_password',
        password_confirmation: 'any_password',
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
        password_confirmation: 'any_password',
      },
    };

    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  test('Should return 500 if EmailValidator throws', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid(email: string): boolean {
        throw new ServerException();
      }
    }
    const emailValidatorStub = new EmailValidatorStub();
    const sut: SignupController = new SignupController(emailValidatorStub);

    const httpRequest: Request = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any_password',
        password_confirmation: 'any_password',
      },
    };

    const httpResponse: Response = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerException());
  });
});
