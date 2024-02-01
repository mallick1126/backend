import { Router } from "express";
import {
  changeCurrentPassword,
  refreshAccessTokens,
  updateUserAvatar,
  updateUserCoverImage,
  updateUserInformation,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 2 },
  ]),
  userRegister
);

router.route("/login").post(userLogin);

//secured routes
router.route("/logout").post(verifyJWT, userLogout);
router.route("/refresh-tokens").post(refreshAccessTokens);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-user-info").post(verifyJWT, updateUserInformation);
router
  .route("/update-avatar")
  .post(upload.single("avatar"), verifyJWT, updateUserAvatar);

router
  .route("/update-coverimage")
  .post(upload.single("coverImage"), verifyJWT, updateUserCoverImage);

export default router;
