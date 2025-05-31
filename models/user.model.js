import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
    },
    title: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      default: "user"
    },
    savedPosts: {
      type: [String],
      default: [],
    },
    fbLink: {
      type: String,
    },
    twitterLink: {
      type: String,
    },
    instagramLink: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
