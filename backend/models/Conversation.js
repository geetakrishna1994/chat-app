import mongoose from "mongoose";

const Schema = mongoose.Schema;

const conversationSchema = Schema(
  {
    conversationType: {
      type: String,
      enum: ["private", "group"],
      required: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupName: {
      type: String,
    },
    groupPhotoURL: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
