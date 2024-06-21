// models/notification.js

const { Schema, model, models } = require("mongoose");

const NotificationSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["mention", "follow", "comment", "like", "hate", "message"],
    required: true,
  },
  data: {
    type: Schema.Types.Mixed,
    default: {},
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Optional pre-save hook to update timestamps if needed
NotificationSchema.pre("save", function (next) {
  this.createdAt = Date.now();
  next();
});

const Notification =
  models.Notification || model("Notification", NotificationSchema);

module.exports = Notification;
