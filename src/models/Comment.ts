import mongoose, { Schema, models, model } from "mongoose";

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Comment = models.Comment || model("Comment", CommentSchema);