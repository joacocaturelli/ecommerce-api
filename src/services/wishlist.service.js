import prisma from "../config/prismaClient.js";
import CustomError from "../utils/errors.utils.js";
import { Wishlist } from "../models/wishlist.model.js";
import { getProducts } from "./products.service.js";

export const getWishlistByUser = async (userId) => {
  try {
    // Busca la wishlist por el id del usuario
    const result = await Wishlist.find({ userId }, { productId: true, _id: false });

    // Trasnforma la respuesta en un array de numeros con los products id,
    // reutiliza la funcion getProducts del service
    const { content } = await getProducts(result.map(({ productId }) => productId));

    return {
      ok: true,
      content,
    };
  } catch (error) {
    console.log("Error showing wishlist", error.message);
    throw error;
  }
};

export const addToWishlist = async (userId, productId) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new CustomError("notFound");
    }

    if (!product.isActive) {
      throw new CustomError("notFound");
    }

    const result = await Wishlist.create({ userId, productId });

    return {
      ok: true,
      content: {
        result,
        product,
      },
    };
  } catch (error) {
    console.log("Error adding into wishlist:", error.message);

    if (error.code === 11000) {
      throw new CustomError("conflict");
    }

    throw error;
  }
};

export const removeFromWishlist = async (userId, productId) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new CustomError("notFound");
    }

    const result = await Wishlist.findOneAndDelete({ userId, productId });

    if (!result) {
      throw new CustomError("notFound");
    }

    return {
      ok: true,
      content: {
        result,
        product,
      },
    };
  } catch (error) {
    console.log("Error deleting into wishlist", error.message);
    throw error;
  }
};
