class AppError extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthenticationError extends AppError {
  constructor(code, err) {
    super("Error in token authentication");
    this.status = 403;
    this.code = code;
    this.err = err;
  }
}

export class InvalidDataError extends AppError {
  constructor(parameter, code, err) {
    super(`Invalid input ${parameter}`);
    this.status = 404;
    this.code = code;
    this.err = err;
  }
}

export class PageNotFoundError extends AppError {
  constructor() {
    super("Page not found");
    this.status = 404;
    this.code = "ERR_PAGE_NOT_FOUND";
  }
}

export class OTPError extends AppError {
  constructor(code, message) {
    super(message);
    this.status = 404;
    this.code = code;
  }
}
