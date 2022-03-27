import SignupController from './signup.controller';
import MissingParamException from '../exception/missing-param.exception';
import { Request, Response } from '../protocol/http';

const makeSut = (): SignupController => new SignupController();

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut: SignupController = makeSut();
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
    const sut: SignupController = makeSut();
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
    const sut: SignupController = makeSut();
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
    const sut: SignupController = makeSut();
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
});
