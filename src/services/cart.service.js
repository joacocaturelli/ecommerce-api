import prisma from "../config/prismaClient.js";
import CustomError from "../utils/errors.utils.js";
import { createCheckoutSession } from "./stripe.service.js";
import { Prisma } from "@prisma/client";
import { env } from "../config/env.js";

// Obtenemos el carrito active del user y si no tiene se lo creamos
export const getCart = async (userId) => {
  try {
    let result = await prisma.cart.findFirst({
      where: { userId, status: "ACTIVE" },
      include: { items: { include: { product: true } } },
    });

    if (!result) {
      result = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error getting cart:", error.message);
    throw error;
  }
};

// Obtener un carrito por Id
export const getCartById = async (cartId, userId) => {
  try {
    let result = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    });

    if (!result) {
      throw new CustomError("notFound");
    }

    if (result.userId !== userId) {
      throw new CustomError("forbidden");
    }

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error getting cart:", error.message);
    throw error;
  }
};

// Añadir un producto al carrito
export const addItem = async (userId, productId, quantity = 1) => {
  try {
    // Comprobar que el producto exista en la base de datos
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new CustomError("notFound");
    }

    if (!product.isActive) {
      throw new CustomError("notFound");
    }

    // Extraemos los datos del carrito y lo guardamos como cart
    const cartResult = await getCart(userId);
    const cart = cartResult.content;

    // Comprobar si existe el producto en el carrito
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    // Corroboramos antes de añadir el producto al carrito que la
    // suma total (con lo que ya tenia previamente en el carrito)
    // no sea mayor al stock
    const finalQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (product.stock < finalQuantity) {
      throw new CustomError("badInput");
    }

    // Si existe el producto en el carrito y la cantidad
    // es correcta se la añadimos al producto
    if (existingItem) {
      return {
        ok: true,
        content: await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: finalQuantity },
        }),
      };
    }

    // Si no existe creamos el producto en el carrito
    return {
      ok: true,
      content: await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      }),
    };
  } catch (error) {
    console.log("Error adding item to cart:", error.message);
    throw error;
  }
};

export const removeItem = async (userId, productId) => {
  try {
    const { content: cart } = await getCart(userId);

    const result = await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error deleting cart item", error.message);

    if (error.code === "P2025") {
      throw new CustomError("notFound");
    }

    throw error;
  }
};

// Hacemos el checkout del carrito
export const checkOut = async (userId) => {
  try {
    let order; // Declaramos la variable

    // Creamos la orden usando $transaction para que si una de las peticiones a la DB falla
    // o si lanzamos una excepcion, se haga un rollback cancelando todas las peticiones
    await prisma.$transaction(async (tx) => {
      // Buscamos el carrito activo del usuario
      const cart = await tx.cart.findFirst({
        where: {
          userId,
          status: "ACTIVE",
        },
        include: { items: true },
      });

      if (!cart) {
        throw new CustomError("notFound");
      }

      if (cart.items.length === 0) {
        throw new CustomError("badInput");
      }

      // Obtenemos los ids de los productos
      const productIds = cart.items.map((item) => item.productId);

      // Buscamos esos productos con sus ids
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
        },
      });

      // Creamos un map para acceder rapidamente a cada producto
      const productsMap = Object.fromEntries(products.map((product) => [product.id, product]));

      // Calculamos el total actual del carrito
      const total = cart.items.reduce((sum, item) => {
        const product = productsMap[item.productId];

        if (!product) {
          throw new CustomError("notFound");
        }

        return sum.plus(product.price.times(item.quantity)); // La forma recomendada por Prisma para decimales
      }, new Prisma.Decimal(0));

      // Comprobamos el stock actual
      for (const item of cart.items) {
        const product = productsMap[item.productId];

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

      // Buscamos si ya existe una orden pendiente
      // que pertenezca al mismo carrito
      const pendingOrder = await tx.order.findFirst({
        where: {
          cartId: cart.id,
          status: "PENDING",
        },
      });

      if (pendingOrder) {
        // Si existe reutilizamos la orden pendiente
        // de ESTE carrito
        order = await tx.order.update({
          where: {
            id: pendingOrder.id,
          },
          data: {
            total,
            stripeSessionId: null,
          },
        });

        // Eliminamos los items anteriores de la orden (no del carrito)
        await tx.orderItem.deleteMany({
          where: {
            orderId: order.id,
          },
        });
      } else {
        // Si no existe una orden pendiente la creamos
        // vinculada al carrito
        order = await tx.order.create({
          data: {
            userId,
            cartId: cart.id,
            total,
            status: "PENDING",
          },
        });
      }

      // Creamos el snapshot actual de los productos
      for (const item of cart.items) {
        const product = productsMap[item.productId];

        // Guardamos el historial: que se compro, cuanto y a que precio
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
            price: product.price,
          },
        });
      }
    });

    // Obtenemos la orden con sus items
    const orderWithItems = await prisma.order.findUnique({
      where: {
        id: order.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!orderWithItems) {
      throw new CustomError("badError");
    }

    // Creamos la sesion con Stripe
    const stripeResult = await createCheckoutSession({
      order: orderWithItems,
      items: orderWithItems.items,
      frontendUrl: env.FRONTEND_URL,
    });

    if (!stripeResult.ok) {
      throw new CustomError("badError");
    }

    //Guardamos el ID de la sesion de Stripe
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        stripeSessionId: stripeResult.content.id,
      },
    });

    // Obtenemos de nuevo la orden actualizada con el ID de Stripe
    const finalOrder = await prisma.order.findUnique({
      where: {
        id: order.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return {
      ok: true,
      content: {
        ...finalOrder,
        url: stripeResult.content.url,
      },
    };
  } catch (error) {
    console.log("Error doing checking out:", error.message);
    throw error;
  }
};
