import { Schema } from "mongoose";
import mongoose from "mongoose";

const webinfoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Webinfo", webinfoSchema);
