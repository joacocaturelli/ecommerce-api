// Chequeo de variables obligatorias de .env (Propuesto por ChatGPT)
import "dotenv/config";

// Parse CORS_ORIGINS: string separado por comas o array
let corsOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

if (process.env.CORS_ORIGINS !== undefined && process.env.CORS_ORIGINS.trim() !== "") {
  corsOrigins = process.env.CORS_ORIGINS.split(",").map((url) => url.trim());
}

// Variables obligatorias: si falta alguna, no tiene sentido levantar el server
const REQUIRED_VARS = [
  "JWT_SECRET",
  "DATABASE_URL",
  "DIRECT_URL",
  "MONGO_URI",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_PUBLIC_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "FRONTEND_URL",
];

const errors = [];

// 1. Chequeo de presencia
for (const key of REQUIRED_VARS) {
  const value = process.env[key];

  if (value === undefined || value === null || value.trim() === "") {
    errors.push(`Falta la variable de entorno: ${key}`);
  }
}

// 2. Chequeos de formato específicos (solo si la variable existe)
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("postgresql://")) {
  errors.push("DATABASE_URL debe ser una URL de Postgres válida (postgresql://...)");
}

if (process.env.DIRECT_URL && !process.env.DIRECT_URL.startsWith("postgresql://")) {
  errors.push("DIRECT_URL debe ser una URL de Postgres válida (postgresql://...)");
}

if (process.env.MONGO_URI && !process.env.MONGO_URI.startsWith("mongodb")) {
  errors.push("MONGO_URI debe ser una URI de Mongo válida (mongodb:// o mongodb+srv://)");
}

const validEnvs = ["development", "production", "test"];
const nodeEnv = process.env.NODE_ENV || "development";
if (!validEnvs.includes(nodeEnv)) {
  errors.push(`NODE_ENV debe ser uno de: ${validEnvs.join(", ")} (recibido: "${nodeEnv}")`);
}

let port = 3000;
if (process.env.PORT !== undefined) {
  port = Number(process.env.PORT);

  if (Number.isNaN(port) || !Number.isInteger(port) || port <= 0) {
    errors.push(`PORT debe ser un número entero positivo (recibido: "${process.env.PORT}")`);
  }
}

// 3. Si algo falló, mostramos TODOS los errores juntos y frenamos el arranque
if (errors.length > 0) {
  console.error("Variables de entorno inválidas:");
  errors.forEach((msg) => console.error(`  - ${msg}`));
  process.exit(1);
}

// 4. Exportamos un objeto ya validado y "normalizado" (con los tipos correctos)
export const env = {
  NODE_ENV: nodeEnv,
  PORT: port,
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  MONGO_URI: process.env.MONGO_URI,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CORS_ORIGINS: corsOrigins,
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
};
