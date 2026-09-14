import * as productsService from "../services/products.service.js"; // Importamos el objeto con las funciones de services
import CustomError from "../utils/errors.utils.js";
import { needNumber } from "../utils/common.utils.js";

export const getProducts = async (req, res, next) => {
  try {
    // includeInactive es un query parameter opcional.
    // Ejemplo: GET /products?includeInactive=true
    const { includeInactive } = req.query;

    // Este controller obtiene todos los productos.
    // No necesitamos filtrar por IDs, por eso pasamos undefined como primer argumento.
    // (en la peticion que se hace desde la wishlist si se pasan los ids)
    // req.query siempre recibe los valores como strings: "true" / "false".
    // Por eso convertimos "true" en el booleano true antes de pasarlo al service.
    const result = await productsService.getProducts(undefined, includeInactive === "true");

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

// Funcion para obtener un solo producto pasando un Id
export const getProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await productsService.getProductById(id);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

// Funcion para crear un producto nuevo
export const createOneProduct = async (req, res, next) => {
  try {
    // Obtenemos todos los elementos del body pasados por el usuario
    const { name, description, price, stock } = req.body;

    // Comprobamos que price y stock sean validos
    const priceResult = needNumber(price);

    if (!priceResult.ok) {
      throw new CustomError("badInput");
    }

    let validateStock;

    if (stock !== undefined) {
      const stockResult = needNumber(stock, { integer: true });

      if (!stockResult.ok) {
        throw new CustomError("badInput");
      }

      validateStock = stockResult.content;
    }

    const result = await productsService.createProduct(
      {
        name,
        description,
        price: priceResult.content,
        stock: validateStock,
      },
      req.file, // si hay un archivo para la imagen lo pasa, si no es undefined
    );

    return res.status(201).json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

// Funcion para actualizar un producto
export const updateOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Obtenemos todos los elementos del body pasados por el usuario
    const { name, description, price, stock } = req.body;

    let validatePrice;

    if (price !== undefined) {
      const priceResult = needNumber(price);

      if (!priceResult.ok) {
        throw new CustomError("badInput");
      }

      validatePrice = priceResult.content;
    }

    let validateStock;

    if (stock !== undefined) {
      const stockResult = needNumber(stock, { integer: true });

      if (!stockResult.ok) {
        throw new CustomError("badInput");
      }

      validateStock = stockResult.content;
    }

    // Creamos un objeto dinamico en el que si un campo es undefinded
    // directamente no lo enviamos al service. Esto sirve para que si
    // actualizamos el producto y solamente enviamos un archivo de imagen
    // el form-data no nos actualice los campos a ""
    const updateData = {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: validatePrice }),
      ...(stock !== undefined && { stock: validateStock }),
    };

    const result = await productsService.updateProduct(
      // Actualizamos el producto
      id,
      updateData,
      req.file,
    );

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

// Funcion para desactivar el producto sin eliminarlo de la DB
export const deleteOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await productsService.deleteProduct(id);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

// Funcion para reactivar un producto desactivado por un ADMIN
export const restoreOneProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await productsService.restoreProduct(id);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};
