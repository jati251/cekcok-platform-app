import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema({
  message: { type: String, required: true },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Message = models.Message || model("Message", MessageSchema);

export default Message;
