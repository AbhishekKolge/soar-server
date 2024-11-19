const { BadRequestError } = require("../error");
const { MAX_IMAGE_SIZE } = require("./default");

const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises;

const uploadGoogleImage = async (imagePath, folder) => {
  const result = await cloudinary.uploader.upload(imagePath, {
    use_filename: true,
    folder: `${process.env.APP_NAME.split(" ").join("-")}/${folder}`,
  });

  return result;
};

const uploadImage = async (key, folder, req) => {
  if (!req.files || !req.files[key]) {
    throw new BadRequestError("No file attached");
  }

  const image = req.files[key];

  if (!image.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload an image");
  }

  if (image.size >= MAX_IMAGE_SIZE) {
    throw new BadRequestError("Please upload an image smaller than 1 MB");
  }
  const result = await cloudinary.uploader.upload(image.tempFilePath, {
    use_filename: true,
    folder: `${process.env.APP_NAME.split(" ").join("-")}/${folder}`,
  });

  await fs.unlink(image.tempFilePath);

  return result;
};

const deleteCloudinaryImage = async (imageId) => {
  await cloudinary.uploader.destroy(imageId);
};

module.exports = { uploadImage, deleteCloudinaryImage, uploadGoogleImage };
