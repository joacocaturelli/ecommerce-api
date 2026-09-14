import prisma from "../config/prismaClient.js";
import CustomError from "../utils/errors.utils.js";

export const getUserOrders = async (userId) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" }, // Mas recientes primero
    });

    return {
      ok: true,
      content: orders,
    };
  } catch (error) {
    console.log("Error getting user orders:", error.message);
    throw error;
  }
};

export const getOrderById = async (orderId, userId) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new CustomError("notFound");
    }

    if (order.userId !== userId) {
      throw new CustomError("forbidden");
    }

    return {
      ok: true,
      content: order,
    };
  } catch (error) {
    console.log("Error getting order:", error.message);
    throw error;
  }
};
