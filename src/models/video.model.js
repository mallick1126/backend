import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
  videoFile: {
    type: String, //url
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  thumbnail: {
    type: String, //url
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  duration: {
    type: String, //url
    required: true,
  },

  views: {
    type: Number,
    default: 0,
  },

  isPublished: {
    type: String,
    default: true,
  },
});

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);
