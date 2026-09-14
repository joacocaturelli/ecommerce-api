import * as cartService from "../services/cart.service.js";
import CustomError from "../utils/errors.utils.js";
import { needNumber } from "../utils/common.utils.js";

export const getCart = async (req, res, next) => {
  try {
    const { id } = res.locals;

    const result = await cartService.getCart(id);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCartById = async (req, res, next) => {
  try {
    const cartId = req.params.cartId;
    const { id: userId } = res.locals;

    const result = await cartService.getCartById(cartId, userId);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const addItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const { id } = res.locals;

    let validateQuantity;
    if (quantity !== undefined) {
      const quantityResult = needNumber(quantity, { integer: true });

      if (!quantityResult.ok) {
        throw new CustomError("badInput");
      }

      validateQuantity = quantityResult.content;
    }

    const result = await cartService.addItem(id, productId, validateQuantity);

    return res.status(201).json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const { id } = res.locals;

    const result = await cartService.removeItem(id, productId);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const checkOut = async (req, res, next) => {
  try {
    const { id } = res.locals;

    const result = await cartService.checkOut(id);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};
