import stripe from "../config/stripe.js";
import prisma from "../config/prismaClient.js";

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
    console.log("Error creating Stripe chechout session", error.message);

    return {
      ok: false,
    };
  }
};

export const handleCheckoutSessionCompleted = async (session) => {
  try {
    // Obtenemos el ID de nuestra orden desde los metadatos
    // que guardamos cuando creamos la sesión de Stripe.
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      throw new Error("El evento de Stripe no contiene orderId");
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
        throw new Error("Orden no encontrada");
      }

      // Idempotencia:
      // si Stripe vuelve a enviar el evento, no procesamos la compra otra vez.
      if (order.status === "PAID") {
        return;
      }

      if (order.status !== "PENDING") {
        throw new Error(`La orden no está pendiente: ${order.status}`);
      }

      // Comprobamos nuevamente el stock antes de descontarlo
      for (const item of order.items) {
        const product = await tx.product.findUnique({
          where: {
            id: item.productId,
          },
        });

        if (!product) {
          throw new Error(`Producto no encontrado: ${item.productId}`);
        }

        if (!product.isActive) {
          throw new Error(`Producto no disponible: ${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para el producto: ${product.name}`);
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
    console.log("Error procesando checkout.session.completed:", error.message);

    return {
      ok: false,
    };
  }
};

export const handleCheckoutSessionCancelled = async (session) => {
  try {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      throw new Error("El evento de Stripe no contiene orderId");
    }

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: {
          id: orderId,
        },
      });

      if (!order) {
        throw new Error(`Orden no encontrada: ${orderId}`);
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
        throw new Error(`La orden no esta pendiente: ${orderId}`);
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
    console.log("Error cancelando la orden desde Stripe:", error.message);

    return {
      ok: false,
    };
  }
};
