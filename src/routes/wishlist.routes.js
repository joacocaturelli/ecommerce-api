import express from "express";
import * as wishListController from "../controllers/wishlist.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/wishlist:
 *   get:
 *     summary: Obtener la wishlist del usuario autenticado
 *     description: >
 *       Devuelve los productos completos de la wishlist del usuario.
 *       El service obtiene los productIds guardados en Mongo y luego llama
 *       a getProducts() en Prisma, por lo que la respuesta son objetos Product
 *       completos, no los documentos de wishlist.
 *     tags:
 *       - Wishlist
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Wishlist obtenida correctamente
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
 *                     $ref: "#/components/schemas/Product"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/", authMiddleware, wishListController.getWishlistByUser);

/**
 * @openapi
 * /api/wishlist/items:
 *   post:
 *     summary: Añadir un producto a la wishlist
 *     description: >
 *       Verifica que el producto exista en Prisma y crea el documento en Mongo.
 *       Un usuario no puede tener el mismo producto dos veces en la wishlist.
 *       Si intenta, devuelve 409 Conflict.
 *       Devuelve el documento Mongo creado (WishlistDocument).
 *     tags:
 *       - Wishlist
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["productId"]
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       201:
 *         description: Producto añadido a la wishlist correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/WishlistDocument"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       409:
 *         description: El producto ya está en la wishlist del usuario
 *         $ref: "#/components/responses/ConflictError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.post("/items", authMiddleware, wishListController.addToWishlist);

/**
 * @openapi
 * /api/wishlist/items:
 *   delete:
 *     summary: Eliminar un producto de la wishlist
 *     description: >
 *       Elimina el documento de wishlist del usuario sobre el producto indicado.
 *       Devuelve el documento Mongo eliminado (WishlistDocument).
 *     tags:
 *       - Wishlist
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["productId"]
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Producto eliminado de la wishlist. Devuelve el documento eliminado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/WishlistDocument"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.delete("/items", authMiddleware, wishListController.removeFromWishlist);

export default router;
