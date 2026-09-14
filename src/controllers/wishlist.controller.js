import * as wishlistService from "../services/wishlist.service.js";

export const getWishlistByUser = async (req, res, next) => {
  try {
    const { id } = res.locals;

    const result = await wishlistService.getWishlistByUser(id);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const { id } = res.locals;

    const result = await wishlistService.addToWishlist(id, productId);

    return res.status(201).json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const { id } = res.locals;

    const result = await wishlistService.removeFromWishlist(id, productId);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};
