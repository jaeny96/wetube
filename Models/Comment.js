import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: "Text is required",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const model = mongoose.model("Comment", CommentSchema);
export default model;

//   1. comment에 video id를 저장하는 방법
//   video: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Video",
//   },
