import { Schema } from "mongoose";
import mongoose from "mongoose";

const activitySchema = new Schema(
  {
    message: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
