import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
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

const publishVideo = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
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
    throw new ApiError(500, "Something went wrong while uploading the video.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { uploadedVideo }, "Video Published Successfully!")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "No video found.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Retrieved successfully!"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  const {} = req.query;
});

const updateVideo = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  const userId = req.user?._id;
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "No video found.");
  }
  if (userId.toString() !== video.owner.toString()) {
    throw new ApiError(400, "You are not authorized");
  }

  const { title, description } = req.body;
  const thumbnailLocalPath = req.file?.path;

  let thumbnailUrl = video.thumbnail;
  if (thumbnailLocalPath) {
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    thumbnailUrl = uploadedThumbnail.url;
  }

  video.title = title;
  video.description = description;
  video.thumbnail = thumbnailUrl;
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated Successfully!"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  const userId = req.user?._id;
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "No video found.");
  }
  if (userId.toString() !== video.owner.toString()) {
    throw new ApiError(400, "You are not authorized");
  }

  await Video.deleteOne({ _id: videoId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {});

export {
  publishVideo,
  getVideoById,
  getAllVideos,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
