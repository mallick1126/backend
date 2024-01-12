import { asyncHandler } from "../utils/asyncnHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isEmailRegistered, isUsernameTaken } from "../utils/validation.js";
import { uploadOnCloudinary } from "../utils/cloudinary.config.js";

const userRegister = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  //   if (!username || !email || !fullname || !password) {
  //     throw new ApiError(499, {
  //       message: `Please fill the required fields!`,
  //     });
  //   }

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

  const newUser = User.create({
    username: username.toLowerCase(),
    email,
    fullname,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  console.log(createdUser);
  //finding the user with the provided id and selecting the items that we don't want.
  const createdUser = await User.findOne(newUser._id).select(
    "-password -refreshToken"
  );
 
  if (!createdUser)
    throw new ApiError(500, `Something went wrong while registering the user`);

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, `User registered successfully!`));
});

export { userRegister };
