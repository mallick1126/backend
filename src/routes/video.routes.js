import { Router } from "express";
import {
  deleteVideo,
  getVideoById,
  publishVideo,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/get-video/:id").get(getVideoById);

//  secured routes
router.route("/publish-video").post(
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishVideo
);

router
  .route("/update-video/:id")
  .post(verifyJWT, upload.single("thumbnail"), updateVideo);

router.route("/delete-video/:id").delete(verifyJWT, deleteVideo);
export default router;
