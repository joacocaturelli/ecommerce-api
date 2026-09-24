import * as authService from "../services/auth.service.js";
import { cookieOptions } from "../utils/common.utils.js";

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const emailNormalized = email.toLowerCase();

    const result = await authService.registerUser({
      email: emailNormalized,
      password,
      name,
    });

    return res.status(201).json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const emailNormalized = email.toLowerCase();

    const result = await authService.loginUser({
      email: emailNormalized,
      password,
    });

    res.cookie("token", result.content.token, cookieOptions);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");

  return res.json({
    ok: true,
    data: "Sesion cerrada",
  });
};
