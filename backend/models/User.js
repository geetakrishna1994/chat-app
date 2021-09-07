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

    conversations: [
      {
        conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
        recipientId: { type: Schema.Types.ObjectId, ref: "User" },
        unReadCount: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
