const errors = {
  badInput: {
    statusCode: 400,
    message: "Incorrect input data",
  },

  missingInput: {
    statusCode: 400,
    message: "Missing input data",
  },

  wrongCredentials: {
    statusCode: 401,
    message: "Incorrect credentials",
  },

  noToken: {
    statusCode: 401,
    message: "Invalid token or expired",
  },

  forbidden: {
    statusCode: 403,
    message: "Insufficient permissions",
  },

  notFound: {
    statusCode: 404,
    message: "Resource not found",
  },

  conflict: {
    statusCode: 409,
    message: "Resource already exists",
  },

  badError: {
    statusCode: 500,
    message: "Something went wrong",
  },
};

export default class CustomError extends Error {
  constructor(errorType) {
    const error = errors[errorType] ?? errors.badError;

    super(error.message);

    this.name = "CustomError";
    this.statusCode = error.statusCode;
  }
}
