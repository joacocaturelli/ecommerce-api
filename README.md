# 🛍️ E-Commerce Backend API

Una **API REST completa y profesional** para un sistema de e-commerce desarrollada con **Node.js, Express y Prisma ORM**. Arquitectura modular en capas con autenticación JWT, gestión de múltiples bases de datos y documentación interactiva con Swagger.

**Documentación Swagger en vivo:**  
👉 [https://backend-e-commerce-keoz.onrender.com/api/docs](https://backend-e-commerce-keoz.onrender.com/api/docs)

---

## ✨ Características Principales

- ✅ **Autenticación segura** - JWT en cookies HTTP-only
- ✅ **Control de roles** - USER y ADMIN con permisos granulares
- ✅ **Gestión de productos** - CRUD completo con imágenes en Cloudinary
- ✅ **Carrito de compras** - Persistencia en BD con múltiples estados
- ✅ **Sistema de órdenes** - Checkout y historial de compras
- ✅ **Reseñas de productos** - Validación de ratings y restricción de usuario
- ✅ **Wishlist/Favoritos** - Guardado persistente de productos favoritos
- ✅ **Integración Stripe** - Pagos seguros con webhooks
- ✅ **Documentación OpenAPI 3.0** - 30+ endpoints documentados interactivamente
- ✅ **Seguridad robusta** - Helmet, CORS dinámico, rate limiting, bcrypt
- ✅ **Manejo de errores** - Manejador centralizado con códigos personalizados
- ✅ **Escalabilidad** - Arquitectura desacoplada y modular

---

## 🏗️ Arquitectura

### Patrón de Capas

```
HTTP Request
    ↓
Routes (Enrutamiento)
    ↓
Middlewares (Auth, Validación)
    ↓
Controllers (Orquestación)
    ↓
Services (Lógica de Negocio)
    ↓
Database Layer (Prisma/MongoDB)
    ↓
JSON Response
```

| Capa            | Función                                         |
| --------------- | ----------------------------------------------- |
| **Routes**      | Definición de endpoints y métodos HTTP          |
| **Middlewares** | Autenticación, validación, autorización         |
| **Controllers** | Orquestación de request/response                |
| **Services**    | Lógica de negocio, transacciones y validaciones |
| **Models**      | Esquemas de datos (Prisma/MongoDB)              |
| **Utils**       | Funciones auxiliares reutilizables              |
| **Config**      | Configuración de servicios externos             |

---

## 📊 Estructura del Proyecto

```
projectBackend/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma                        # Esquema principal de datos
│
├── src/
│   │
│   ├── config/                              # Configuraciones externas
│   │   ├── cloudinary.js                    # Almacenamiento de imágenes
│   │   ├── env.js                           # Validación variables de entorno
│   │   ├── mongo.js                         # Conexión MongoDB
│   │   ├── multer.js                        # Configuración de uploads
│   │   ├── prismaClient.js                  # Cliente Prisma singleton
│   │   ├── stripe.js                        # Configuración de Stripe
│   │   └── swagger.js                       # Documentación OpenAPI 3.0
│   │
│   ├── controllers/                         # Orquestación de requests
│   │   ├── auth.controller.js               # Registro, login, logout
│   │   ├── cart.controller.js               # Gestión de carrito
│   │   ├── order.controller.js              # Órdenes y checkout
│   │   ├── products.controller.js           # Productos (CRUD)
│   │   ├── review.controllers.js            # Reviews/Reseñas
│   │   ├── server.controller.js             # Health checks
│   │   ├── stripe.controller.js             # Webhooks Stripe
│   │   ├── users.controller.js              # Gestión de usuarios
│   │   └── wishlist.controller.js           # Favoritos/Wishlist
│   │
│   ├── middlewares/                         # Middlewares Express
│   │   ├── auth.middleware.js               # Autenticación JWT
│   │   ├── errorHandler.middleware.js       # Manejo centralizado de errores
│   │   ├── requireRole.middleware.js        # Control de roles
│   │   └── validate.middleware.js           # Validación de datos
│   │
│   ├── models/                              # Esquemas MongoDB
│   │   ├── adminLog.model.js                # Logs de administrador
│   │   ├── review.model.js                  # Modelo de reviews
│   │   └── wishlist.model.js                # Modelo de wishlist
│   │
│   ├── routes/                              # Definición de endpoints
│   │   ├── auth.routes.js                   # /api/auth/*
│   │   ├── cart.routes.js                   # /api/cart/*
│   │   ├── index.routes.js                  # Rutas raíz
│   │   ├── orders.routes.js                 # /api/orders/*
│   │   ├── products.routes.js               # /api/products/*
│   │   ├── review.routes.js                 # /api/reviews/*
│   │   ├── users.routes.js                  # /api/users/*
│   │   └── wishlist.routes.js               # /api/wishlist/*
│   │
│   ├── services/                            # Lógica de negocio
│   │   ├── auth.service.js                  # Autenticación
│   │   ├── cart.service.js                  # Carrito
│   │   ├── cloudinary.service.js            # Integración Cloudinary
│   │   ├── order.service.js                 # Órdenes
│   │   ├── products.service.js              # Productos
│   │   ├── review.service.js                # Reviews
│   │   ├── stripe.service.js                # Pagos Stripe
│   │   ├── users.service.js                 # Usuarios
│   │   └── wishlist.service.js              # Wishlist
│   │
│   ├── utils/                               # Utilidades
│   │   ├── common.utils.js                  # Funciones comunes
│   │   └── errors.utils.js                  # Clases de error personalizadas
│   │
│   ├── app.js                               # Configuración Express
│   └── server.js                            # Punto de entrada
│
├── .env.example                             # Ejemplo de variables
├── .gitignore                               # Git ignore
├── package.json                             # Dependencias
├── package-lock.json
├── prisma.config.js
└── README.md
```

---

## 🗄️ Modelos de Datos

### Prisma (PostgreSQL)

```prisma
User
├── id (UUID, PK)
├── name
├── email (UNIQUE)
├── password (hash)
├── role (enum: USER, ADMIN)
├── createdAt, updatedAt
└── relations: carts[], orders[]

Product
├── id (UUID, PK)
├── name
├── description
├── price (Decimal)
├── stock
├── imageUrl
├── isActive
├── createdAt, updatedAt
└── relations: cartItems[], orderItems[]

Cart
├── id (UUID, PK)
├── userId (FK)
├── status (enum: ACTIVE, CHECKED_OUT)
├── createdAt, updatedAt
└── relations: user, items[], orders[]

CartItem
├── id (UUID, PK)
├── cartId (FK)
├── productId (FK)
├── quantity
└── unique(cartId, productId)

Order
├── id (UUID, PK)
├── userId (FK)
├── cartId (FK)
├── total (Decimal)
├── status (enum: PENDING, PAID, CANCELLED)
├── stripeSessionId
├── createdAt, updatedAt
└── relations: user, cart, items[]

OrderItem
├── id (UUID, PK)
├── orderId (FK)
├── productId (FK)
├── productName
├── quantity
└── price (Decimal)
```

### MongoDB

```javascript
Review
├── _id
├── userId
├── productId
├── rating (1-5)
├── title
├── comment
├── createdAt, updatedAt
└── unique(userId, productId)

Wishlist
├── _id
├── userId
├── productId
├── createdAt

AdminLog
├── _id
├── userId
├── action
├── description
├── timestamp
```

---

## 🛠️ Tecnologías Utilizadas

### Core

- **Node.js** - Runtime de JavaScript
- **Express.js 5.2.1** - Framework web

### Bases de Datos

- **Prisma ORM 7.8.0** - PostgreSQL
- **MongoDB 9.10.0** - NoSQL (reviews, wishlist, logs)
- **PostgreSQL** - Base de datos relacional principal

### Autenticación & Seguridad

- **JWT 9.0.3** - Token-based authentication
- **bcrypt 6.0.0** - Password hashing
- **helmet 8.2.0** - HTTP security headers
- **express-rate-limit 8.5.2** - Rate limiting
- **cors 2.8.6** - CORS configurado

### Almacenamiento & Upload

- **Cloudinary 2.10.0** - Cloud storage para imágenes
- **Multer 2.3.0** - Middleware para uploads

### Pagos

- **Stripe 22.6.2** - Payment processing

### Documentación

- **swagger-jsdoc 6.3.0** - OpenAPI spec generator
- **swagger-ui-express 5.0.1** - Interactive docs

### Testing

- **Jest 30.4.2** - Testing framework

---

## 📦 Instalación

### Requisitos Previos

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **PostgreSQL** ≥ 12 (o Supabase)
- **MongoDB** con acceso remoto
- Cuentas en: **Stripe**, **Cloudinary**

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/joacocaturelli/backend-e-commerce.git
   cd projectBackend
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales
   ```

4. **Ejecutar migraciones de BD**

   ```bash
   npx prisma migrate dev
   ```

5. **Iniciar servidor**

   ```bash
   # Desarrollo con hot-reload
   npm run dev

   # Producción
   npm start
   ```

El servidor estará disponible en `http://localhost:3000`

---

## 🔐 Variables de Entorno

Crear `.env` basado en `.env.example`:

### Servidor

```bash
PORT=3000
NODE_ENV="development"
```

### PostgreSQL (Prisma)

```bash
DATABASE_URL="postgresql://usuario:pass@localhost:5432/ecommerce"
DIRECT_URL="postgresql://usuario:pass@db.supabase.co:5432/postgres"
```

### MongoDB

```bash
MONGO_URI="mongodb+srv://usuario:pass@cluster.mongodb.net/ecommerce"
```

### JWT

```bash
JWT_SECRET="tu-secreto-super-seguro-cambiar-en-produccion"
JWT_EXPIRE="7d"
```

### Cloudinary

```bash
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"
```

### Stripe

```bash
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### CORS (Opcional)

```bash
CORS_ORIGINS="http://localhost:5173,http://localhost:3000,https://tuapp.com"
```

---

## 📚 API Endpoints

### 🔑 Autenticación (`/api/auth`)

```http
POST /api/auth/register              # Registrar usuario
POST /api/auth/login                 # Iniciar sesión
POST /api/auth/logout                # Cerrar sesión
```

### 📦 Productos (`/api/products`)

```http
GET    /api/products                 # Listar todos
GET    /api/products/{id}            # Detalle
POST   /api/products                 # Crear [ADMIN]
PUT    /api/products/{id}            # Actualizar [ADMIN]
DELETE /api/products/{id}            # Eliminar [ADMIN]
```

### 🛒 Carrito (`/api/cart`)

```http
GET    /api/cart                     # Obtener carrito activo (auto-crea)
GET    /api/cart/{cartId}            # Obtener por ID
POST   /api/cart/items               # Añadir producto
PUT    /api/cart/items               # Actualizar cantidad
DELETE /api/cart/items               # Eliminar producto
POST   /api/cart/checkout            # Checkout (crear orden)
DELETE /api/cart                     # Vaciar carrito
```

### 📝 Reseñas (`/api/reviews`)

```http
GET    /api/reviews                  # Mis reseñas
GET    /api/products/{productId}/reviews       # Del producto
POST   /api/products/{productId}/reviews       # Crear [AUTH]
PUT    /api/reviews/{productId}     # Actualizar [AUTH]
DELETE /api/reviews/{productId}     # Eliminar [AUTH]
```

### ❤️ Wishlist (`/api/wishlist`)

```http
GET    /api/wishlist                 # Obtener lista [AUTH]
POST   /api/wishlist/add/{productId} # Añadir [AUTH]
DELETE /api/wishlist/{productId}     # Eliminar [AUTH]
```

### 📦 Órdenes (`/api/orders`)

```http
GET    /api/orders                   # Mis órdenes [AUTH]
GET    /api/orders/{orderId}         # Detalle [AUTH]
```

### 👤 Usuarios (`/api/users`)

```http
GET    /api/users/profile            # Perfil autenticado [AUTH]
GET    /api/users                    # Todos [ADMIN]
GET    /api/users/{userId}           # Detalle [ADMIN]
PUT    /api/users/{userId}           # Actualizar rol [ADMIN]
DELETE /api/users/{userId}           # Eliminar [ADMIN]
```

### 🏥 Server

```http
GET    /                             # Estado
GET    /health                       # Health check
```

---

## 📤 Ejemplo de Respuestas

### ✅ Éxito (2xx)

```json
{
  "ok": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "role": "USER",
    "createdAt": "2026-09-12T20:18:00.000Z"
  }
}
```

### ❌ Error (4xx, 5xx)

```json
{
  "ok": false,
  "error": "El email ya está registrado",
  "code": "CONFLICT"
}
```

---

## ⚠️ Códigos de Error

| Código HTTP | Código Interno | Significado                       |
| ----------- | -------------- | --------------------------------- |
| 400         | BAD_INPUT      | Datos de entrada incorrectos      |
| 400         | MISSING_INPUT  | Faltan campos obligatorios        |
| 401         | WRONG_CRED     | Email o contraseña incorrectos    |
| 401         | NO_TOKEN       | Token inválido/expirado o ausente |
| 401         | UNAUTHORIZED   | Usuario sin rol requerido         |
| 404         | NOT_FOUND      | Recurso no encontrado             |
| 409         | CONFLICT       | Recurso duplicado/conflicto       |
| 429         | RATE_LIMIT     | Demasiadas peticiones             |
| 500         | BAD_ERROR      | Error interno del servidor        |

---

## ✔️ Validaciones

- ✅ Email válido y único
- ✅ Contraseña mínimo 8 caracteres
- ✅ Ratings 1-5 en reviews
- ✅ Stock no negativo
- ✅ Un usuario, una reseña por producto
- ✅ Autenticación requerida en rutas protegidas
- ✅ Roles granulares por endpoint

---

## 🔒 Seguridad

### Medidas Implementadas

- ✅ **JWT en cookies HTTP-only** - No accesible por JavaScript
- ✅ **Helmet** - Headers de seguridad HTTP
- ✅ **CORS dinámico** - Orígenes configurables por env
- ✅ **Password hashing** - bcrypt con salts
- ✅ **Rate limiting** - Prevención de brute-force
- ✅ **Validación centralizada** - Filtrado temprano de inputs
- ✅ **Control de roles** - Autorización por endpoint
- ✅ **Variables de entorno** - Secretos protegidos

### Configuración CORS

```javascript
// Desarrollo (por defecto)
["http://localhost:3000", "http://localhost:5173"];

// Personalizar en .env
CORS_ORIGINS = "http://localhost:5173,https://tuapp.com";
```

---

## 🚀 Despliegue

### Production URL

**Render:** https://backend-e-commerce-keoz.onrender.com

**Swagger:** https://backend-e-commerce-keoz.onrender.com/api/docs

### Pasos para Desplegar

1. Hacer push a rama main/deploy
2. Render conecta automáticamente
3. Migraciones se ejecutan automáticamente
4. Servidor se reinicia

### Checklist Pre-Despliegue

- [ ] Variables de entorno en Render
- [ ] Migraciones BD ejecutadas
- [ ] JWT_SECRET actualizado
- [ ] CORS_ORIGINS configurado
- [ ] Stripe webhooks activos

---

## 📊 Performance & Escalabilidad

### Optimizaciones

- Índices en base de datos
- Lazy loading de relaciones
- Caching en variables de entorno
- Rate limiting estratégico
- Validación temprana

### Arquitectura Escalable

- Modular y desacoplada
- BD normalizada
- Servicios independientes
- Fácil agregar nuevas funcionalidades

---

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Watch mode
npm run test:watch
```

---

## 📖 Documentación Swagger

Acceder a: `http://localhost:3000/api/docs`

Características:

- 30+ endpoints documentados
- 18 esquemas OpenAPI reutilizables
- Ejemplos realistas en todos los campos
- Códigos HTTP completos (200, 201, 400, 401, 403, 404, 409, 429, 500)
- Seguridad documentada (Cookie Auth con JWT)

---

## 🐛 Troubleshooting

### Error: "No PG_HOST variable"

```bash
# Asegurar que DATABASE_URL está en .env
DATABASE_URL="postgresql://user:pass@localhost:5432/ecommerce"
```

### Error: "MongoNetworkError"

```bash
# Verificar MONGO_URI y conectividad
MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/ecommerce"
```

### CORS bloqueado

```bash
# Añadir origen a .env
CORS_ORIGINS="http://localhost:5173,http://localhost:3000"
```

### Rate limit alcanzado

```bash
# Esperar o cambiar config en common.utils.js
```

---

## 📚 Recursos & Referencias

- [Express.js Documentation](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [JWT.io](https://jwt.io/)
- [Stripe API](https://stripe.com/docs/api)
- [Cloudinary Upload API](https://cloudinary.com/documentation)
- [OpenAPI 3.0 Spec](https://spec.openapis.org/oas/v3.0.3)
- [MongoDB Docs](https://docs.mongodb.com/)

---

## 👨‍💻 Autor

**Joaquín Caturelli**

- GitHub: [@joacocaturelli](https://github.com/joacocaturelli)

---

**Última actualización:** Septiembre 2026
