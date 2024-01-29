import { asyncHandler } from "../utils/asyncnHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isEmailRegistered, isUsernameTaken } from "../utils/validation.js";
import { uploadOnCloudinary } from "../utils/cloudinary.config.js";
import { generateAccessTokenAndRefreshToken } from "../utils/tokens.js";

// Register User
const userRegister = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  /* if (!username || !email || !fullname || !password) {
      throw new ApiError(499, {
        message: `Please fill the required fields!`,
      });
    }*/

  //validating each field to be not empty.
  if (
    [username, email, fullname, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, `Please fill all the required fields.`);
  }

  // checking if the username is taken.
  if (await isUsernameTaken(username))
    throw new ApiError(409, "Username is already taken");

  // checking if the email is already registered.
  if (await isEmailRegistered(email))
    throw new ApiError(409, "Email is already registered");

  // retrieving the local path of the file uploaded by the user.
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(409, `Avatar file is required`);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(409, `Avatar file is required`);
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const newUser = await User.create({
    username: username.toLowerCase(),
    email,
    fullname,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  //finding the user with the provided id and selecting the items that we don't want.
  const createdUser = await User.findOne(newUser._id).select(
    "-password -refreshToken"
  );

  console.log(createdUser);
  if (!createdUser) {
    throw new ApiError(500, `Something went wrong while registering the user`);
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, `User registered successfully!`));
});

// Login User
const userLogin = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "Username and email are required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordMatch = await user.isPasswordCorrect(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = {
    ...user.toObject(),
    password: undefined,
    refreshToken: undefined,
  };

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully!"
      )
    );
});

// User Logout
const userLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User Logged out"));
});
export { userRegister, userLogin, userLogout };
