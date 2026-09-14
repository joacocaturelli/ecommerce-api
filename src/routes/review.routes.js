import express from "express";
import * as reviewController from "../controllers/review.controllers.js";
import * as validate from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/reviews:
 *   get:
 *     summary: Obtener reviews del usuario autenticado
 *     description: >
 *       Devuelve las reviews creadas por el usuario autenticado.
 *     tags:
 *       - Reviews
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Reviews del usuario obtenidas correctamente
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
 *                     $ref: "#/components/schemas/ReviewByUser"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/", authMiddleware, reviewController.getReviewByUser);

/**
 * @openapi
 * /api/reviews/{productId}:
 *   put:
 *     summary: Actualizar la review del usuario sobre un producto
 *     description: >
 *       Actualiza la review del usuario autenticado sobre el producto indicado.
 *       Al menos uno de los campos (`rating` o `comment`) es obligatorio.
 *       Si se envía `rating`, debe ser un número entero entre 1 y 5.
 *       Devuelve el documento Mongo completo actualizado.
 *     tags:
 *       - Reviews
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: UUID del producto en Prisma
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ReviewPut"
 *     responses:
 *       200:
 *         description: Review actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/Review"
 *       400:
 *         $ref: "#/components/responses/BadInputError"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.put(
  "/:productId",
  authMiddleware,
  validate.necessaryOne(["rating", "comment"]),
  reviewController.updateReview,
);

/**
 * @openapi
 * /api/reviews/{productId}:
 *   delete:
 *     summary: Eliminar la review del usuario sobre un producto
 *     description: >
 *       Elimina la review del usuario autenticado sobre el producto indicado.
 *       Devuelve el documento Mongo completo que fue eliminado.
 *     tags:
 *       - Reviews
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: UUID del producto en Prisma
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Review eliminada. Devuelve el documento eliminado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/Review"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.delete("/:productId", authMiddleware, reviewController.deleteReview);

export default router;
