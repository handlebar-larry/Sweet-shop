const fs = require("fs");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (localFilePath) => {
  const uploadOptions = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const uploadResult = await cloudinary.uploader.upload(localFilePath, uploadOptions);
    fs.unlinkSync(localFilePath);
    return uploadResult.secure_url;
  } catch (uploadError) {
    try {
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    } catch (_) {
      // ignore
    }

    console.error(uploadError);
    return undefined;
  }
};

module.exports = { uploadImageToCloudinary };
