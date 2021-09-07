import mongoose from "mongoose";

const Schema = mongoose.Schema;

const authSchema = Schema(
  {
    phoneNumber: {
      type: Number,
      required: true,
      index: true,
      unique: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Authentication", authSchema);
