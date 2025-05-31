import { Schema } from "mongoose";
import mongoose from "mongoose";

const categorySchema = new Schema(
  {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
