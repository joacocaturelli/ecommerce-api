import jwt from "jsonwebtoken";
import CustomError from "../utils/errors.utils.js";
import { env } from "../config/env.js";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.clearCookie("token");
    return next(new CustomError("noToken"));
  }

  try {
    // Verificamos la firma y obtenemos los datos del token
    const user = jwt.verify(token, env.JWT_SECRET);

    const { id, email, role, name } = user;

    res.locals.id = id;
    res.locals.email = email;
    res.locals.role = role;
    res.locals.name = name;

    return next();
  } catch (error) {
    console.log("Error verifying token:", error.message);

    res.clearCookie("token");

    return next(new CustomError("noToken"));
  }
};
