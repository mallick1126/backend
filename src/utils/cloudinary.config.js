import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folderName) => {
  if (!localFilePath) return null;
  try {
    const uploadOptions = {
      folder: `snapstream/${folderName}`,
      resource_type: "auto",
    };
    const response = await cloudinary.uploader.upload(
      localFilePath,
      uploadOptions
    );
    // console.log(`File uploaded on cloudinary!`, response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (remotePath) => {
  if (!remotePath) return null;
  const path = remotePath.replace(".png", "");
  console.log(path);
  try {
    await cloudinary.uploader
      .destroy(path)
      .then((result) => console.log(result));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/*const deleteFromCloudinary = async (remotePath) => {
  try {
    if (!remotePath) return null;
    const regex = /[\w\.\$]+(?=.png|.jpg|.gif)/;
    let matches;
    if ((matches = regex.exec(remotePath)) !== null) {
      await cloudinary.uploader
        .destroy(matches[0])
        .then((result) => console.log(result));
    }
  } catch (error) {
    console.error(error)
    throw error;
  }
};*/

export { uploadOnCloudinary, deleteFromCloudinary };
