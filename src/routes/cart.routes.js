import express from "express";
import * as cartController from "../controllers/cart.controller.js";
import * as validate from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/cart:
 *   get:
 *     summary: Obtener el carrito del usuario autenticado
 *     description: >
 *       Devuelve el carrito ACTIVE del usuario. Si no existe, lo crea automáticamente.
 *       Incluye los items del carrito con productId y quantity.
 *     tags:
 *       - Cart
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Carrito obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/Cart"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/", authMiddleware, cartController.getCart);

/**
 * @openapi
 * /api/cart/{cartId}:
 *   get:
 *     summary: Obtener un carrito por ID
 *     description: >
 *       Busca un carrito por su UUID y verifica que pertenezca al usuario autenticado.
 *       Devuelve 404 si no existe o si el carrito no pertenece al usuario.
 *     tags:
 *       - Cart
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         description: UUID del carrito (debe pertenecer al usuario autenticado)
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Carrito encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/Cart"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 */
router.get("/:cartId", authMiddleware, cartController.getCartById);

/**
 * @openapi
 * /api/cart/items:
 *   post:
 *     summary: Añadir o actualizar un producto en el carrito
 *     description: >
 *       Si el producto ya existe en el carrito, suma la quantity indicada a la existente.
 *       Si no existe, crea un nuevo CartItem.
 *       El campo `quantity` es opcional: si no se proporciona, se asume 1.
 *       Devuelve el CartItem creado o actualizado (no el carrito completo).
 *     tags:
 *       - Cart
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
 *                 example: "f99f9e94-767b-4bd2-aae2-b2ea09702b52"
 *                 description: ID del producto (requerido)
 *               quantity:
 *                 type: integer
 *                 example: 1
 *                 description: Cantidad a añadir (opcional, default 1)
 *     responses:
 *       201:
 *         description: Item añadido o actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/CartItem"
 *       400:
 *         $ref: "#/components/responses/BadInputError"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.post("/items", authMiddleware, validate.obligatory(["productId"]), cartController.addItem);

/**
 * @openapi
 * /api/cart/items:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     description: >
 *       Elimina un CartItem del carrito activo del usuario autenticado.
 *       Si el producto no existe en el carrito, devuelve error.
 *       Devuelve el CartItem eliminado.
 *     tags:
 *       - Cart
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
 *                 description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/CartItem"
 *       400:
 *         $ref: "#/components/responses/BadInputError"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.delete(
  "/items",
  authMiddleware,
  validate.obligatory(["productId"]),
  cartController.removeItem,
);

/**
 * @openapi
 * /api/cart/checkout:
 *   post:
 *     summary: Finalizar compra del carrito
 *     description: >
 *      Prepara el checkout del carrito ACTIVE del usuario autenticado.
 *      Valida que el carrito exista, tenga productos y que haya stock disponible.
 *      Crea o reutiliza una Order con estado PENDING y crea sus OrderItems
 *      guardando una copia del nombre, cantidad y precio de cada producto.
 *      Después crea una sesión de Stripe Checkout y devuelve su URL.
 *      El stock y el estado del carrito se actualizan cuando Stripe confirma
 *      el pago mediante el webhook.
 *     tags:
 *       - Cart
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Checkout iniciado correctamente. Devuelve la Order PENDING y la URL de Stripe Checkout.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/CheckoutResponse"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       400:
 *         $ref: "#/components/responses/BadInputError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.post("/checkout", authMiddleware, cartController.checkOut);

export default router;
