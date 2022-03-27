class InvalidParamException extends Error {
  constructor(paramName: string) {
    const paramNormalized = paramName.trim().toLowerCase();
    super(`Invalid param: ${paramNormalized}`);
    this.name = 'InvalidParamException';
  }
}

export default InvalidParamException;
