import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (file) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
        },
        (error, result) => {
          if (error) return reject(error);

          resolve(result);
        },
      );

      stream.end(file.buffer);
    });

    return {
      ok: true,
      content: result,
    };
  } catch (error) {
    console.log("Error uploading image", error.message);
    throw error;
  }
};
