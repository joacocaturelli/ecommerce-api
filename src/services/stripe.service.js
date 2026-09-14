import stripe from "../config/stripe.js";
import prisma from "../config/prismaClient.js";
import CustomError from "../utils/errors.utils.js";

export const createCheckoutSession = async ({ order, items, frontendUrl }) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.productName,
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      })),

      metadata: {
        orderId: order.id,
      },

      success_url: `${frontendUrl}/order/${order.id}/success`,
      cancel_url: `${frontendUrl}/cart`,
    });

    return {
      ok: true,
      content: session,
    };
  } catch (error) {
    console.log("Error creating Stripe checkout session", error.message);
    throw error;
  }
};

export const handleCheckoutSessionCompleted = async (session) => {
  try {
    // Obtenemos el ID de nuestra orden desde los metadatos
    // que guardamos cuando creamos la sesión de Stripe.
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      throw new CustomError("badInput");
    }

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          items: true,
        },
      });

      if (!order) {
        throw new CustomError("notFound");
      }

      // Idempotencia:
      // si Stripe vuelve a enviar el evento, no procesamos la compra otra vez.
      if (order.status === "PAID") {
        return;
      }

      if (order.status !== "PENDING") {
        throw new CustomError("badInput");
      }

      // Comprobamos nuevamente el stock antes de descontarlo
      for (const item of order.items) {
        const product = await tx.product.findUnique({
          where: {
            id: item.productId,
          },
        });

        if (!product) {
          throw new CustomError("notFound");
        }

        if (!product.isActive) {
          throw new CustomError("notFound");
        }

        if (product.stock < item.quantity) {
          throw new CustomError("badInput");
        }
      }

      // Descontamos el stock
      for (const item of order.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Marcamos la orden como pagada
      await tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: "PAID",
        },
      });

      // Cerramos el carrito activo del usuario
      await tx.cart.update({
        where: {
          id: order.cartId,
        },
        data: {
          status: "CHECKED_OUT",
        },
      });
    });

    return {
      ok: true,
    };
  } catch (error) {
    console.log("Error processing checkout.session.completed:", error.message);
    throw error;
  }
};

export const handleCheckoutSessionCancelled = async (session) => {
  try {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      throw new CustomError("badInput");
    }

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: {
          id: orderId,
        },
      });

      if (!order) {
        throw new CustomError("notFound");
      }

      // Si ya esta cancelada no hacemos nada
      if (order.status === "CANCELLED") {
        return;
      }

      // Si ya esta pagada no se cancela
      if (order.status === "PAID") {
        return;
      }

      if (order.status !== "PENDING") {
        throw new CustomError("badInput");
      }

      await tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: "CANCELLED",
        },
      });
    });

    return {
      ok: true,
    };
  } catch (error) {
    console.log("Error cancelling the order via Stripe:", error.message);
    throw error;
  }
};
