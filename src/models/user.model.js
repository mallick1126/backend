import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required!"],
    },

    avatar: {
      type: String, //url from a third party
      required: true,
    },

    coverImage: {
      type: String, //url from a third part
    },

    refreshToken: {
      type: String,
    },

    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

/***
 * now mongoose provides us with some `${hooks (middleware functions)}` that helps us to perform certain action with our data
 * refer to mongoose middleware documentation to learn more about it.
 * here we will use *** pre hook *** to hash the password before the user save their detials.
 */

/*** we'll check if the password field has been modified if its not,
 * the function returns `next()` to proceed with the saving process.
 * we'll check this otherwise the password will get hashed everytime user changes anything and saves it.
 */

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

/*This method is used to compare a given password with the hashed password stored in the user document. */
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
