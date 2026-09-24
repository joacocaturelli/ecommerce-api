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

    console.log("🔐 LOGIN ATTEMPT:");
    console.log("   Email:", emailNormalized);
    console.log("   Origin:", req.get("origin"));
    console.log("   User-Agent:", req.get("user-agent"));
    console.log("   Cookie options:", cookieOptions);

    const result = await authService.loginUser({
      email: emailNormalized,
      password,
    });

    console.log("✅ LOGIN EXITOSO, enviando cookie...");
    console.log("   Token:", result.content.token.substring(0, 20) + "...");

    res.cookie("token", result.content.token, cookieOptions);

    console.log("✅ Cookie establecida");
    console.log("   Set-Cookie header:", res.getHeader("Set-Cookie"));

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    console.log("❌ ERROR LOGIN:", error.message);
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
