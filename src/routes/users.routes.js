import express from "express";
import * as userControllers from "../controllers/users.controller.js";
import * as validate from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requiredRole } from "../middlewares/requireRole.middleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     description: >
 *       Devuelve únicamente `email` y `role` del usuario autenticado
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/UserProfile"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 */
router.get("/me", authMiddleware, userControllers.getProfile);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios (solo ADMIN)
 *     description: >
 *       Requiere rol ADMIN. Devuelve todos los usuarios sin el campo `password`
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/User"
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/", authMiddleware, requiredRole, userControllers.getUsers);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID (solo ADMIN)
 *     description: >
 *       Requiere rol ADMIN. Devuelve el usuario sin el campo `password`
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID del usuario en Prisma
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/UserProfile"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       403:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/:id", authMiddleware, requiredRole, userControllers.getUserById);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar el rol de un usuario (solo ADMIN)
 *     description: >
 *       Requiere rol ADMIN. Actualiza el rol de otro usuario.
 *       El campo `role` es obligatorio y debe ser "USER" o "ADMIN".
 *       Devuelve el usuario completo actualizado sin `password`
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID del usuario en Prisma
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserPut"
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/User"
 *       400:
 *         $ref: "#/components/responses/BadInputError"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       403:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.put(
  "/:id",
  authMiddleware,
  requiredRole,
  validate.obligatory(["role"]),
  userControllers.updateUser,
);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario (solo ADMIN)
 *     description: >
 *       Requiere rol ADMIN. Elimina el usuario de forma permanente.
 *       Devuelve el objeto User completo que fue eliminado (sin `password`).
 *       Devuelve 404 si el usuario no existe.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID del usuario en Prisma
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Usuario eliminado. Devuelve el objeto eliminado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/User"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       403:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.delete("/:id", authMiddleware, requiredRole, userControllers.deleteUser);

export default router;
