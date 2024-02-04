import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncnHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.config.js";

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  if (hours > 0) {
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  } else {
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }
}

const uploadVideo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(409, "Title and Description is required!");
  }

  const videoLocalPath = req.files?.videoFile[0].path;
  const thumbnailLocalPath = req.files?.thumbnail[0].path;
  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(409, "Video file is required!");
  }
  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  const actualDuration = formatDuration(videoFile.duration);
  const newVideo = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    owner: userId,
    duration: actualDuration,
    isPublished: true,
  });

  const uploadedVideo = await Video.findOne(newVideo._id);
  if (!uploadedVideo) {
    throw new ApiError(500, "Something went wrong while uploading the video");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { uploadedVideo }, "Video uploaded Successfully")
    );
});



export { uploadVideo, getAllVideos, getVideoById };
