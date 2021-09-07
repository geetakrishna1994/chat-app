import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    phoneNumber: {
      type: Number,
      index: true,
      unique: true,
      required: true,
    },
    displayName: {
      type: String,
      default: "",
    },
    photoURL: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      about: ".",
    },
    status: {
      type: String,
      enum: ["online", "offline"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
