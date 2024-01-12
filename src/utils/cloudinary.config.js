import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(`File uploaded on cloudinary!`, response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };



/* About the function */
/**
 * The function `uploadOnCloudinary` uploads a file to Cloudinary and returns the response, or null if
 * there is an error.
 * @param localFilePath - The localFilePath parameter is the path to the file that you want to upload
 * to Cloudinary. It should be a string representing the file's location on your local machine.
 * @returns The function `uploadOnCloudinary` returns the response object if the file upload is
 * successful. If there is an error during the upload process, the function returns null.
 */