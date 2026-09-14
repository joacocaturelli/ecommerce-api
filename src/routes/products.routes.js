import express from "express";
import upload from "../config/multer.js";
import * as productsController from "../controllers/products.controller.js";
import * as validate from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requiredRole } from "../middlewares/requireRole.middleware.js";
import { getReviewByProduct, createReviewByProduct } from "../controllers/review.controllers.js";

const router = express.Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     description: >
 *       Devuelve un array con todos los productos activos y disponibles.
 *     tags:
 *       - Products
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente
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
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/", productsController.getProducts);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags:
 *       - Products
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID del producto en Prisma
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/Product"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/:id", productsController.getProduct);

/**
 * @openapi
 * /api/products/{productId}/reviews:
 *   get:
 *     summary: Obtener reviews de un producto
 *     description: >
 *       Devuelve todas las reviews que otros usuarios han dejado sobre el producto.
 *     tags:
 *       - Reviews
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
 *         description: Reviews del producto obtenidas correctamente
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
 *                     $ref: "#/components/schemas/ReviewByProduct"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/:productId/reviews", getReviewByProduct);

/**
 * @openapi
 * /api/products/{productId}/reviews:
 *   post:
 *     summary: Crear una review para un producto
 *     description: >
 *      Crea una review del usuario autenticado sobre el producto indicado.
 *      El usuario debe haber comprado previamente el producto en un pedido pagado.
 *      Un usuario solo puede tener una review por producto.
 *      Si intenta crear una segunda, devuelve 409 Conflict.
 *      El campo `rating` debe ser un número entero entre 1 y 5.
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
 *             $ref: "#/components/schemas/ReviewCreateByProduct"
 *     responses:
 *       201:
 *         description: Review creada correctamente
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
 *       409:
 *         description: El usuario ya tiene una review sobre este producto
 *         $ref: "#/components/responses/ConflictError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.post("/:productId/reviews", authMiddleware, createReviewByProduct);

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Crear un producto (solo ADMIN)
 *     description: >
 *       Requiere rol ADMIN. Si el usuario no tiene permisos suficientes, devuelve un error de autorización.
 *       Los campos `name` y `price` son obligatorios.
 *       Los campos `price` y `stock` deben ser números válidos.
 *       Para subir imagen, usa `imageUrl` como multipart/form-data en POST /api/products/image.
 *       Campo `stock` es opcional, default es 0.
 *     tags:
 *       - Products
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: ["name", "price"]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "iPhone 15"
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 example: 999.99
 *               stock:
 *                 type: integer
 *                 example: 10
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/Product"
 *       400:
 *         $ref: "#/components/responses/BadInputError"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       403:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.post(
  "/",
  authMiddleware,
  requiredRole,
  upload.single("imageUrl"),
  validate.obligatory(["name", "price"]),
  productsController.createOneProduct,
);

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar un producto (solo ADMIN)
 *     description: >
 *       Requiere rol ADMIN. Actualiza uno o más campos del producto.
 *       Al menos uno de los campos del body es obligatorio.
 *       Si se envían `price` o `stock`, deben ser números válidos.
 *       Para cambiar imagen, envía nuevo archivo con `imageUrl`.
 *     tags:
 *       - Products
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID del producto en Prisma
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/UpdateProduct"
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/Product"
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
  upload.single("imageUrl"),
  validate.removeEmptyMultipartFields,
  validate.necessaryOne(["name", "description", "price", "stock"], { file: true }),
  productsController.updateOneProduct,
);

/**
 * @openapi
 * /api/products/deactivate/{id}:
 *   put:
 *     summary: Desactivar un producto (solo ADMIN)
 *     description: >
 *       Requiere rol ADMIN. Desactiva el producto estableciendo su estado
 *       `isActive` en false. El producto no se elimina de la base de datos.
 *     tags:
 *       - Products
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID del producto en Prisma
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Producto desactivado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/Product"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       403:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.put("/deactivate/:id", authMiddleware, requiredRole, productsController.deleteOneProduct);

/**
 * @openapi
 * /api/products/activate/{id}:
 *   put:
 *     summary: Activar un producto (solo ADMIN)
 *     description: >
 *       Requiere rol ADMIN. Activa el producto estableciendo su estado
 *       `isActive` en true.
 *     tags:
 *       - Products
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID del producto en Prisma
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Producto activado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/Product"
 *       401:
 *         $ref: "#/components/responses/NoTokenError"
 *       403:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.put("/activate/:id", authMiddleware, requiredRole, productsController.restoreOneProduct);

export default router;
