import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API e-commerce",
      version: "1.0.0",
      description:
        "API REST para un e-commerce. Autenticación mediante cookie HTTP-only (JWT). " +
        "Los endpoints protegidos requieren haber hecho login previamente. " +
        "Los endpoints marcados como ADMIN requieren role='ADMIN' en el token.",
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },

      schemas: {
        // =====================
        // USER
        // =====================
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "3b6pj70d-5652-4547-95ad-43fe157e7b98" },
            name: { type: "string", example: "User1278" },
            email: { type: "string", example: "test@mail.com" },
            role: {
              type: "string",
              enum: ["USER", "ADMIN"],
              example: "USER",
            },
            createdAt: { type: "string", format: "date-time", example: "2026-08-01T14:30:15.123Z" },
            updatedAt: { type: "string", format: "date-time", example: "2026-08-01T14:30:15.123Z" },
          },
        },

        // =====================
        // USER PROFILE
        // =====================
        UserProfile: {
          type: "object",
          properties: {
            email: { type: "string", example: "test@mail.com" },
            name: { type: "string", example: "User1278" },
            role: {
              type: "string",
              enum: ["USER", "ADMIN"],
              example: "USER",
            },
          },
        },

        // =====================
        // PRODUCT
        // =====================
        Product: {
          type: "object",
          properties: {
            id: { type: "string", example: "3b64470d-5652-4547-95ad-43fe157e7b9f" },
            name: { type: "string", example: "iPhone 15" },
            description: { type: "string", nullable: true },
            price: { type: "string", example: "999.99" },
            stock: { type: "integer", example: 10 },
            imageUrl: { type: "string", nullable: true },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time", example: "2026-08-01T14:30:15.123Z" },
            updatedAt: { type: "string", format: "date-time", example: "2026-08-01T14:30:15.123Z" },
          },
        },

        // =====================
        // CART
        // =====================
        Cart: {
          type: "object",
          properties: {
            id: { type: "string", example: "3b64470d-5652-4547-95ad-43fe157e7b9f" },
            userId: { type: "string", example: "3b64470d-5652-4547-95ad-43fe157e7b9f" },
            status: {
              type: "string",
              enum: ["ACTIVE", "CHECKED_OUT"],
            },
            createdAt: { type: "string", format: "date-time", example: "2026-08-01T14:30:15.123Z" },
            updatedAt: { type: "string", format: "date-time", example: "2026-08-01T14:30:15.123Z" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/CartItem" },
            },
          },
        },

        // =====================
        // CART ITEM
        // =====================
        CartItem: {
          type: "object",
          properties: {
            id: { type: "string", example: "3b64470d-5652-4547-95ad-43fe157e7b9f" },
            cartId: { type: "string", example: "3b64470d-5652-4547-95ad-43fe157e7b9f" },
            productId: { type: "string", example: "3b64470d-5652-4547-95ad-43fe157e7b9f" },
            quantity: { type: "integer", example: 1 },
          },
        },

        // =====================
        // REVIEW
        // =====================
        Review: {
          type: "object",
          properties: {
            _id: { type: "string" },
            productId: { type: "string", example: "3b64470d-5652-4547-95ad-43fe157e7b9f" },
            userId: { type: "string", example: "3b64470d-5652-4547-95ad-43fe157e7b9f" },
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string" },
            createdAt: { type: "string", format: "date-time", example: "2026-08-01T14:30:15.123Z" },
            updatedAt: { type: "string", format: "date-time", example: "2026-08-01T14:30:15.123Z" },
          },
        },

        ReviewByUser: {
          type: "object",
          properties: {
            productId: { type: "string" },
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string" },
          },
        },

        ReviewByProduct: {
          type: "object",
          properties: {
            userId: { type: "string" },
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string" },
          },
        },

        // =====================
        // WISHLIST
        // =====================
        WishlistDocument: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            productId: { type: "string" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        // =====================
        // ORDER
        // =====================
        Order: {
          type: "object",
          properties: {
            id: { type: "string", example: "3b64470d-5652-4547-95ad-43fe157e7b9f" },
            userId: { type: "string", example: "3b64470d-5652-4547-95ad-43fe157e7b9f" },
            cartId: { type: "string", example: "3b64470d-5652-4547-95ad-43fe157e7b9f" },
            total: { type: "string", example: "1999.98" },
            status: {
              type: "string",
              enum: ["PENDING", "PAID", "CANCELLED"],
              example: "PENDING",
            },
            createdAt: { type: "string", format: "date-time", example: "2026-08-01T14:30:15.123Z" },
            updatedAt: { type: "string", format: "date-time", example: "2026-08-01T14:30:15.123Z" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
          },
        },

        // =====================
        // ORDER ITEM
        // =====================
        OrderItem: {
          type: "object",
          properties: {
            id: { type: "string" },
            orderId: { type: "string" },
            productId: { type: "string" },
            productName: { type: "string", example: "iPhone 15" },
            quantity: { type: "integer", example: 2 },
            price: { type: "string", example: "999.99" },
          },
        },

        // =====================
        // CHECKOUT
        // =====================

        CheckoutResponse: {
          allOf: [
            { $ref: "#/components/schemas/Order" },
            {
              type: "object",
              properties: {
                url: {
                  type: "string",
                  format: "uri",
                  example: "https://checkout.stripe.com/c/pay/cs_test_...",
                },
              },
            },
          ],
        },

        // =====================
        // INPUTS - AUTH
        // =====================
        AuthCredentials: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "user@swagger.com" },
            password: { type: "string", example: "12345678" },
          },
        },

        AuthRegister: {
          type: "object",
          required: ["email", "password", "name"],
          properties: {
            email: { type: "string", example: "user@swagger.com" },
            password: { type: "string", example: "12345678" },
            name: { type: "string", example: "SwaggerUser21" },
          },
        },

        // =====================
        // INPUTS — PRODUCT
        // =====================
        CreateProduct: {
          type: "object",
          required: ["name", "price"],
          properties: {
            name: { type: "string", example: "iPhone 15" },
            description: { type: "string" },
            price: { type: "string", example: 999.99 },
            stock: { type: "integer", example: 10 },
            imageUrl: { type: "string" },
          },
        },

        UpdateProduct: {
          type: "object",
          description:
            "Al menos uno de los campos es obligatorio. " +
            "Si se envían price o stock, deben ser números.",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "string" },
            stock: { type: "integer" },
            imageUrl: { type: "string" },
          },
        },

        // =====================
        // INPUTS — CART
        // =====================
        AddCartItem: {
          type: "object",
          required: ["productId"],
          properties: {
            productId: {
              type: "string",
              example: "3b64470d-5652-4547-95ad-43fe157e7b9f",
            },
            quantity: {
              type: "integer",
              example: 2,
              description: "Cantidad a añadir. Si no se proporciona, se utiliza 1.",
            },
          },
        },

        // =====================
        // INPUTS — REVIEW
        // =====================
        ReviewCreateByProduct: {
          type: "object",
          required: ["rating"],
          description:
            "El usuario debe haber comprado previamente el producto en un pedido pagado.",
          properties: {
            rating: {
              type: "integer",
              minimum: 1,
              maximum: 5,
              example: 4,
            },
            comment: {
              type: "string",
              example: "Muy buen producto",
            },
          },
        },

        ReviewPut: {
          type: "object",
          description:
            "Al menos uno de los dos campos es obligatorio. " +
            "Si se envía rating, debe ser un número entre 1 y 5.",
          properties: {
            rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
            comment: { type: "string", example: "Actualizado: excelente" },
          },
        },

        // =====================
        // INPUTS — USER
        // =====================
        UserPut: {
          type: "object",
          required: ["role"],
          properties: {
            role: {
              type: "string",
              enum: ["USER", "ADMIN"],
              example: "USER",
            },
          },
        },

        ErrorResponse: {
          type: "object",
          required: ["ok", "error"],
          properties: {
            ok: { type: "boolean", example: false },
            error: { type: "string", example: "something went wrong" },
          },
        },
      },

      // =====================
      // SHARED RESPONSES
      // =====================
      responses: {
        // 400 - BAD_INPUT
        BadInputError: {
          description: "Datos de entrada incorrectos (BAD_INPUT)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { ok: false, error: "incorrect input data" },
            },
          },
        },

        // 400 - MISSING_INPUT
        MissingInputError: {
          description: "Faltan datos obligatorios en el body (MISSING_INPUT)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { ok: false, error: "missing input data" },
            },
          },
        },

        // 400 - WRONG_CRED
        WrongCredentialsError: {
          description: "Email o contraseña incorrectos (WRONG_CRED)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { ok: false, error: "incorrect credentials" },
            },
          },
        },

        // 401 - NO_TOKEN
        NoTokenError: {
          description: "Sin sesión activa o token inválido/expirado (NO_TOKEN)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { ok: false, error: "invalid token or expired" },
            },
          },
        },

        // 403 - UNAUTHORIZED
        UnauthorizedError: {
          description: "El usuario no tiene el rol requerido (UNAUTHORIZED)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { ok: false, error: "unauthorized" },
            },
          },
        },

        // 404 - NOT_FOUND
        NotFoundError: {
          description: "Recurso no encontrado (NOT_FOUND)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { ok: false, error: "resource not found" },
            },
          },
        },

        // 409 - CONFLICT
        ConflictError: {
          description: "Conflicto de datos - recurso ya existe (CONFLICT)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { ok: false, error: "resource already exists" },
            },
          },
        },

        // 429 - TOO_MANY_REQUESTS
        TooManyRequests: {
          description: "Demasiadas peticiones",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: {
                ok: false,
                error: "Demasiadas peticiones, intentalo de nuevo en 15 minutos",
              },
            },
          },
        },

        // 500 - BAD_ERROR
        ServerError: {
          description: "Error interno del servidor (BAD_ERROR)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { ok: false, error: "something went wrong" },
            },
          },
        },
      },
    },

    security: [{ cookieAuth: [] }],
  },

  apis: ["./src/routes/*.js"],
});
