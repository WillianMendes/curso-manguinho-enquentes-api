class MissingParamException extends Error {
  constructor(paramName: string) {
    const paramNormalized = paramName.trim().toLowerCase();
    super(`Missing param: ${paramNormalized}`);
    this.name = 'MissingParamException';
  }
}

export default MissingParamException;
