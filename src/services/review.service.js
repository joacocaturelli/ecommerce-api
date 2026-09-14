import prisma from "../config/prismaClient.js";
import CustomError from "../utils/errors.utils.js";
import { Review } from "../models/review.model.js";

export const getReviewByUser = async (userId) => {
  try {
    const result = await Review.find(
      { userId },
      {
        productId: true,
        rating: true,
        comment: true,
        _id: false,
      },
    );

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error showing all reviews", error.message);
    throw error;
  }
};

export const getReviewByProduct = async (productId) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new CustomError("notFound");
    }

    const result = await Review.find(
      { productId },
      {
        userId: true,
        rating: true,
        comment: true,
        _id: false,
      },
    );

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error al obtener las reviews del producto", error.message);
    throw error;
  }
};

export const createReview = async (userId, productId, rating, comment) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new CustomError("notFound");
    }

    // Comprobar que el usuario haya comprado el producto antes de poder hacerle una review
    const purchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: "PAID",
        },
      },
    });

    if (!purchased) {
      throw new CustomError("forbidden");
    }

    const result = await Review.create({ userId, productId, rating, comment });

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error creating the review", error.message);

    if (error.code === 11000) {
      throw new CustomError("conflict");
    }

    throw error;
  }
};

export const updateReview = async (userId, productId, data) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new CustomError("notFound");
    }

    const updateData = {};

    if (data.rating !== undefined) {
      updateData.rating = data.rating;
    }

    if (data.comment !== undefined) {
      updateData.comment = data.comment;
    }

    const result = await Review.findOneAndUpdate(
      { userId, productId },
      { $set: updateData },
      { returnDocument: "after" },
    );

    if (!result) {
      throw new CustomError("notFound");
    }

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error updating review", error.message);
    throw error;
  }
};

export const deleteReview = async (userId, productId) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new CustomError("notFound");
    }

    const result = await Review.findOneAndDelete({ userId, productId });

    if (!result) {
      throw new CustomError("notFound");
    }

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error deleting review", error.message);
    throw error;
  }
};
