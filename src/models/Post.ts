import mongoose, { Schema, models, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    category: { type: String, default: "All" },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Post = models.Post || model("Post", PostSchema);