import CustomError from "../utils/errors.utils.js";

export const obligatory = (fields) => {
  return (req, res, next) => {
    for (const field of fields) {
      const value = req.body[field];

      if (value === undefined || value === null || value === "") {
        return next(new CustomError("badInput"));
      }
    }

    return next();
  };
};

export const necessaryOne = (fields, options = {}) => {
  return (req, res, next) => {
    let hasValue = false;

    for (const field of fields) {
      const value = req.body[field];

      if (value !== undefined && value !== null && value !== "") {
        hasValue = true;
        break;
      }
    }

    // Comprueba si el middleware acepta archivos y si se recibió uno.
    if (options.file && req.file) {
      hasValue = true;
    }

    if (!hasValue) {
      return next(new CustomError("missingInput"));
    }

    return next();
  };
};

export const register = (req, res, next) => {
  const { email, password } = req.body;

  if (typeof password !== "string" || password.length < 8) {
    return next(new CustomError("badInput"));
  }

  if (typeof email !== "string") {
    return next(new CustomError("badInput"));
  }

  return next();
};

export const removeEmptyMultipartFields = (req, res, next) => {
  for (const key in req.body) {
    if (req.body[key] === "") {
      delete req.body[key];
    }
  }

  return next();
};
