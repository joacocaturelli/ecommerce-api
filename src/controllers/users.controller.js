import * as usersService from "../services/users.service.js";
import CustomError from "../utils/errors.utils.js";

export const getProfile = async (req, res, next) => {
  try {
    const { email } = res.locals;

    const result = await usersService.getProfile({ email });

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const result = await usersService.getUsers();

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await usersService.getUserById(id);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const roles = ["ADMIN", "USER"];

    if (typeof role !== "string") {
      throw new CustomError("badInput");
    }

    const upperRole = role.toUpperCase();

    // Comprobamos que el rol sea correcto
    if (!roles.includes(upperRole)) {
      throw new CustomError("badInput");
    }

    const result = await usersService.updateUser(id, { role: upperRole });

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await usersService.deleteUser(id);

    return res.json({
      ok: true,
      data: result.content,
    });
  } catch (error) {
    return next(error);
  }
};
