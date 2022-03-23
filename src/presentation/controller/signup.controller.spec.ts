import SignupController from './signup.controller';
import MissingParamException from '../exception/missing-param.exception';

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignupController();
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        password_confirmation: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamException('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const sut = new SignupController();
    const httpRequest = {
      body: {
        name: 'any name',
        password: 'any_password',
        password_confirmation: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamException('email'));
  });
});
