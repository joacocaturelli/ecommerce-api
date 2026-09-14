import prisma from "../config/prismaClient.js";
import CustomError from "../utils/errors.utils.js";

export const getProfile = async ({ email }) => {
  try {
    const result = await prisma.user.findUnique({
      where: { email },
      omit: { password: true },
    });

    if (!result) {
      throw new CustomError("notFound");
    }

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error getting profile:", error.message);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const result = await prisma.user.findMany({
      omit: { password: true },
    });

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error getting all users:", error.message);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const result = await prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!result) {
      throw new CustomError("notFound");
    }

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error geting user by Id:", error.message);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    const result = await prisma.user.update({
      where: { id },
      omit: { password: true },
      data,
    });

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error updating user:", error.message);

    if (error.code === "P2025") {
      throw new CustomError("notFound");
    }

    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const result = await prisma.user.delete({
      where: { id },
      omit: { password: true },
    });

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error deleting user:", error.message);

    if (error.code === "P2025") {
      throw new CustomError("notFound");
    }

    throw error;
  }
};
