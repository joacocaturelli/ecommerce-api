import { Selector } from "../utils/errors.utils.js";

export const obligatory = (fields) => {
  return (req, res, next) => {
    for (const field of fields) {
      const value = req.body[field];

      if (value === undefined || value === null || value === "" || !value) {
        return next(Selector.BAD_INPUT);
      }
    }

    next();
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

    // options.file comprueba si el middleware fue configurado para aceptar file
    // req. file comprueba si el usuario envio un archivo
    if (options.file && req.file) {
      hasValue = true;
    }

    if (!hasValue) {
      return next(Selector.MISSING_INPUT);
    }

    next();
  };
};

export const Register = (req, res, next) => {
  const { email, password } = req.body;

  if (typeof password !== "string" || password.length < 8) {
    return next(Selector.BAD_INPUT);
  }

  if (typeof email !== "string") {
    return next(Selector.BAD_INPUT);
  }

  next();
};

export const removeEmptyMultipartFields = (req, res, next) => {
  for (const key in req.body) {
    if (req.body[key] === "") {
      delete req.body[key];
    }
  }

  next();
};
