import { User } from "../models/user.model.js";
import { ApiError } from "./apiError.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;

    /* `await user.save({ validateBeforeSave: false });` is saving the user object to the database
    without performing any validation checks before saving. */
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens.");
  }
};

export { generateAccessTokenAndRefreshToken };
