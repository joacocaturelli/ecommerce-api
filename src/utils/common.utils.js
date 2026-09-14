import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  maxAge: 3_600_000, // 1 hora
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
};

// Limitamos las peticiones a 100 por minuto
export const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    ok: false,
    error: "Demasiadas peticiones, intentalo de nuevo en 1 minuto",
  },
});

// Para auth el limite es de 10 intentos cada 15min
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    ok: false,
    error: "Demasiadas peticiones, intentalo de nuevo en 15 minutos",
  },
});

export const needNumber = (value, { integer = false } = {}) => {
  if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
    return { ok: false };
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return { ok: false };
  }

  if (number < 0) {
    return { ok: false };
  }

  if (integer && !Number.isInteger(number)) {
    return { ok: false };
  }

  return {
    ok: true,
    content: number,
  };
};
