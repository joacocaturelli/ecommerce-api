import * as reviewService from "../services/review.service.js";
import CustomError from "../utils/errors.utils.js";
import { needNumber } from "../utils/common.utils.js";

export const getReviewByUser = async (req, res, next) => {
  try {
    const { id } = res.locals;

    const result = await reviewService.getReviewByUser(id);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const getReviewByProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    const result = await reviewService.getReviewByProduct(productId);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const createReviewByProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const { rating, comment } = req.body;
    const { id } = res.locals;

    const ratingResult = needNumber(rating);

    if (!ratingResult.ok || ratingResult.content < 1 || ratingResult.content > 5) {
      throw new CustomError("badInput");
    }

    const result = await reviewService.createReview(id, productId, rating, comment);

    return res.status(201).json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { id } = res.locals;
    const { productId } = req.params;

    // Validar que rating sea un valor correcto
    let validateRating;

    // Si por defecto es undefined lo ignoramos porque el usuario solo
    // quiere actualizar el comment
    if (rating !== undefined) {
      // Funcion que chequea el valor de rating
      const ratingResult = needNumber(rating);

      if (!ratingResult.ok || ratingResult.content < 1 || ratingResult.content > 5) {
        throw new CustomError("badInput");
      }

      validateRating = ratingResult.content;
    }

    // Construccion de objeto dinamico
    // Hacemos spread del del valor anterior de rating y comment
    // si es undefined lo actualizamos, si no lo dejamos como esta
    // 'A && B' ejecuta B solo si A es true
    const result = await reviewService.updateReview(id, productId, {
      ...(validateRating !== undefined && { rating: validateRating }),
      ...(comment !== undefined && { comment }),
    });

    if (!result.ok) return next(Selector.BAD_ERROR);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { id } = res.locals;

    const result = await reviewService.deleteReview(id, productId);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};
