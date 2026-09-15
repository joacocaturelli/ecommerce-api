# Full Stack E-commerce — Backend

API REST desarrollada con **Node.js y Express** para un sistema de e-commerce Full Stack.

El backend gestiona autenticación, usuarios, productos, carrito, pedidos, reseñas, wishlist, pagos mediante Stripe, imágenes mediante Cloudinary y documentación de la API con Swagger/OpenAPI.

## Demo

**Aplicación desplegada:**

https://mitienditaonline.netlify.app

### Repositorios relacionados

Este repositorio forma parte de una aplicación Full Stack desarrollada conjuntamente con un frontend independiente.

- **Frontend:** https://github.com/joacocaturelli/ecommerce-frontend
- **Documentación API :** https://backend-e-commerce-keoz.onrender.com/api/docs

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Autenticación mediante JWT y cookies HTTP-only.
- Autorización basada en roles (`USER` / `ADMIN`).
- CRUD de productos.
- Gestión de carrito de compra.
- Creación y gestión de pedidos.
- Checkout y pagos mediante Stripe.
- Webhooks de Stripe.
- Sistema de reseñas.
- Wishlist.
- Subida y gestión de imágenes mediante Cloudinary.
- Validación de datos.
- Manejo centralizado de errores.
- Protección mediante Helmet.
- Rate limiting.
- Configuración de CORS.
- Documentación de la API mediante Swagger / OpenAPI.
- Persistencia de datos con PostgreSQL, Prisma ORM y MongoDB.

## Tecnologías utilizadas

### Backend

- Node.js
- Express
- JavaScript
- Prisma ORM
- PostgreSQL
- MongoDB
- JWT
- bcrypt
- Jest

### Servicios externos

- Stripe
- Cloudinary

### Seguridad y documentación

- Helmet
- express-rate-limit
- CORS
- Swagger / OpenAPI

## Estructura del proyecto

La estructura está organizada para separar la lógica de negocio, acceso a datos, controladores, rutas y middlewares.

```text
src/
├── config/
├── controllers/
├── middlewares/
├── routes/
├── services/
├── utils/
├── tests/
└── app.js
```

## Arquitectura

El proyecto utiliza una arquitectura modular basada en separación de responsabilidades:

```text
Routes
   ↓
Middlewares
   ↓
Controllers
   ↓
Services
   ↓
Database
   ↓
Response
```

### Capa de datos

Se utilizan dos bases de datos según el tipo de información:

- **PostgreSQL + Prisma ORM:** usuarios, productos, carritos, pedidos y sus relaciones.
- **MongoDB:** reseñas, wishlist y registros adicionales.

## Principales módulos

### Autenticación

- Registro de usuarios.
- Inicio y cierre de sesión.
- Autenticación mediante JWT.
- Cookies HTTP-only.
- Autorización basada en roles.
- Protección de rutas.

### Productos

- Listado de productos.
- Consulta individual.
- Creación de productos.
- Actualización.
- Eliminación.
- Gestión de imágenes.

### Carrito

- Creación y consulta del carrito.
- Añadir productos.
- Modificar cantidades.
- Eliminar productos.
- Vaciar carrito.
- Proceso de checkout.

### Pedidos

- Creación de pedidos.
- Consulta de pedidos.
- Gestión del estado del pedido.
- Integración con Stripe.

### Reseñas y Wishlist

- Creación y gestión de reseñas.
- Añadir y eliminar productos de favoritos.
- Consulta de wishlist.

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/joacocaturelli/ecommerce-api.git
cd projectBackEnd
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las variables necesarias para:

- PostgreSQL
- MongoDB
- JWT
- Cloudinary
- Stripe
- CORS
- Configuración del servidor

### 4. Configurar Prisma

Ejecutar las migraciones correspondientes:

```bash
npx prisma migrate dev
```

### 5. Ejecutar el servidor

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

## Estado del proyecto

Proyecto desarrollado como parte de mi formación como **Full Stack Developer**, aplicando tecnologías y prácticas utilizadas en el desarrollo de aplicaciones web modernas.

Actualmente se encuentra desplegado y funcional.
