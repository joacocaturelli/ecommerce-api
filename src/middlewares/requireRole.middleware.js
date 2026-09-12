import { Selector } from "../utils/errors.utils.js";

// Requerimos que el usario tenga el rol ADMIN
export const requiredRole = (req, res, next) => {
  const { role } = res.locals;

  // Si no lo tiene, no le damos acceso a la ruta
  if (role !== "ADMIN") return next(Selector.UNAUTHORIZED);

  // Si lo tiene imprimimos por consola su actividad
  const now = new Date().toISOString();

  next();
};
