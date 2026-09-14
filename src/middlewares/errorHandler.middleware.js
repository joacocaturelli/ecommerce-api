import CustomError from "../utils/errors.utils.js";

export default (error, req, res, next) => {
  if (!(error instanceof CustomError)) {
    error = new CustomError("badError");
  }

  return res.status(error.statusCode).json({
    ok: false,
    error: error.message,
  });
};
