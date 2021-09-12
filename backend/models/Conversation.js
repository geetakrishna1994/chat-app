import mongoose from "mongoose";
import User from "./User.js";

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
    firebaseId: { type: String },
  },

  { timestamps: true }
);

conversationSchema.post("save", async function () {
  if (this.conversationType === "private") {
    for (let i = 0; i < 2; i++) {
      await User.findByIdAndUpdate(this.users[i], {
        $push: {
          conversations: {
            conversationId: this._id,
            recipientId: this.users[1 - i],
          },
        },
      });
    }
  } else {
    for (let userId of this.users) {
      await User.findByIdAndUpdate(userId, {
        $push: { conversations: { conversationId: this._id } },
      });
    }
  }
});

conversationSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "conversationId",
});

conversationSchema.set("toObject", { virtuals: true });
conversationSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Conversation", conversationSchema);
