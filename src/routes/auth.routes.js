import express from "express";
import * as authController from "../controllers/auth.controller.js";
import * as validate from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../utils/common.utils.js";

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: >
 *       Crea un usuario con role USER por defecto.
 *       No requiere autenticación previa.
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AuthRegister"
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: "User registered"
 *       400:
 *         $ref: "#/components/responses/BadInputError"
 *       429:
 *         $ref: "#/components/responses/TooManyRequests"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.post(
  "/register",
  authLimiter,
  validate.obligatory(["email", "password", "name"]),
  validate.register,
  authController.registerUser,
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: >
 *       Autentica al usuario y establece una cookie HTTP-only llamada `token` con el JWT.
 *       No requiere autenticación previa.
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AuthCredentials"
 *     responses:
 *       200:
 *         description: Login correcto. Se establece la cookie `token` en la respuesta.
 *         headers:
 *           Set-Cookie:
 *             description: "Cookie HTTP-only con el JWT. Nombre: token."
 *             schema:
 *               type: string
 *               example: "token=eyJhbGci...; HttpOnly; Path=/"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: "Welcome"
 *       403:
 *         $ref: "#/components/responses/WrongCredentialsError"
 *       400:
 *         $ref: "#/components/responses/BadInputError"
 *       429:
 *         $ref: "#/components/responses/TooManyRequests"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.post(
  "/login",
  authLimiter,
  validate.obligatory(["email", "password"]),
  authController.loginUser,
);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: >
 *       Elimina la cookie `token` del cliente.
 *       Requiere una sesión activa (cookie válida).
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: "Sesion cerrada"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.post("/logout", authMiddleware, authController.logout);

export default router;
