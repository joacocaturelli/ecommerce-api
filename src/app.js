import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

import indexRoutes from "./routes/index.routes.js";
import productsRoutes from "./routes/products.routes.js";
import authRoutes from "./routes/auth.routes.js";
import reviewsRoutes from "./routes/review.routes.js";
import userRoutes from "./routes/users.routes.js";
import wishListRoutes from "./routes/wishlist.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/orders.routes.js";

import { stripeWebhook } from "./controllers/stripe.controller.js";

import CustomError from "./utils/errors.utils.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import { env } from "./config/env.js";
import { limiter } from "./utils/common.utils.js";

const app = express();

app.use(helmet());

const corsOptions = {
  origin: env.CORS_ORIGINS,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json()); // Para leer los datos del body
app.use(express.urlencoded({ extended: true })); // Para leer los datos del body en formato urlencode
app.use(cookieParser());
app.use(limiter);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", indexRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishListRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res, next) => {
  return next(new CustomError("notFound"));
});

app.use(errorHandler);

export default app;
