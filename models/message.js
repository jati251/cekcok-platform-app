const { Schema, model, models } = require("mongoose");

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

module.exports = Message;
