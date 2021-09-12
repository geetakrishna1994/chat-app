import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = Schema({
  _id: { type: String },
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date },
  deliveredTo: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      deliveredAt: {
        type: Date,
      },
    },
  ],
  readBy: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      readAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  status: { type: String, default: "sent" },
});

export default mongoose.model("Message", messageSchema);
