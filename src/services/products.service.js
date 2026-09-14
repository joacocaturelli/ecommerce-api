import prisma from "../config/prismaClient.js";
import CustomError from "../utils/errors.utils.js";
import { uploadImage } from "./cloudinary.service.js";

export const getProducts = async (productsIds, includeInactive = false) => {
  try {
    // Creamos un objeto dinamico para hacer la peticion a prisma
    const where = {};

    // Si productsIds existe (enviados desde wishlist.service) devuelve solo los productos
    // en la wishlist. Si productsIds no existe, trae todos los productos para el catalogo
    if (productsIds) {
      where.id = {
        in: productsIds,
      };
    }

    // Si includeInacitve es falso trae solo los productos activos, si es
    // true tambien trae los productos inactivos (para admins)
    if (!includeInactive) {
      where.isActive = true;
    }

    const result = await prisma.product.findMany({
      where,
    });

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error getting products", error.message);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const result = await prisma.product.findUnique({
      where: { id },
    });

    if (!result) {
      throw new CustomError("notFound");
    }

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error geting product by Id", error.message);
    throw error;
  }
};

export const createProduct = async (data, file) => {
  try {
    let imageUrl;

    if (file) {
      const imageResult = await uploadImage(file);
      imageUrl = imageResult.content.secure_url;
    }

    const result = await prisma.product.create({
      data: {
        ...data,
        imageUrl,
      },
    });

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error creating product", error.message);
    throw error;
  }
};

export const updateProduct = async (id, data, file) => {
  try {
    let imageUrl;

    if (file) {
      const imageResult = await uploadImage(file);
      imageUrl = imageResult.content.secure_url;
    }

    const result = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(imageUrl && { imageUrl }),
      },
    });

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error updating product", error.message);

    if (error.code === "P2025") {
      throw new CustomError("notFound");
    }

    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const result = await prisma.product.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error deactivating product", error.message);

    if (error.code === "P2025") {
      throw new CustomError("notFound");
    }

    throw error;
  }
};

export const restoreProduct = async (id) => {
  try {
    const result = await prisma.product.update({
      where: { id },
      data: {
        isActive: true,
      },
    });

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error reactivating product", error.message);

    if (error.code === "P2025") {
      throw new CustomError("notFound");
    }

    throw error;
  }
};
