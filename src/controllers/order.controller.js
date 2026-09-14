import * as orderService from "../services/order.service.js";

export const getUserOrders = async (req, res, next) => {
  try {
    const { id: userId } = res.locals;

    const result = await orderService.getUserOrders(userId);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { id: userId } = res.locals; // Usuario autenticado

    const result = await orderService.getOrderById(orderId, userId);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};
