import express from "express";
import * as orderController from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Obtener las orders del usuario autenticado
 *     description: >
 *       Devuelve las orders creadas por el usuario autenticado.
 *       Incluye los items del carrito con productId y quantity.
 *       Se mantienen los price y name del momento en
 *       el que se hizo el checkOut
 *     tags:
 *       - Orders
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Orders del usuario obtenidas correctamente
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
 *                     $ref: "#/components/schemas/Order"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/", authMiddleware, orderController.getUserOrders);

/**
 * @openapi
 * /api/orders/{orderId}:
 *   get:
 *     summary: Obtener una order por su orderId del usuario autenticado
 *     description: >
 *       Devuelve la order del usuario. Incluye los items del carrito con
 *       productId y quantity. Se mantienen los price y name del momento en
 *       el que se hizo el checkOut
 *     tags:
 *       - Orders
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: UUID de la order (debe pertenecer al usuario autenticado)
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Order obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/Order"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/:orderId", authMiddleware, orderController.getOrderById);

export default router;
