import CustomError from "../utils/errors.utils.js";

// Requerimos que el usario tenga el rol ADMIN
export const requiredRole = (req, res, next) => {
  const { role } = res.locals;

  // Si no lo tiene, no le damos acceso a la ruta
  if (role !== "ADMIN") {
    return next(new CustomError("forbidden"));
  }

  return next();
};
