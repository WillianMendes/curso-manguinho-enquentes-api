class SignupController {
  // eslint-disable-next-line no-unused-vars
  public handle(httpRequest : any): any {
    return {
      statusCode: 400,
      body: new Error('Missing param: name'),
    };
  }
}

export default SignupController;
