import { Schema, model, models } from "mongoose";

const commentSchema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Prompt", required: true },
  likes: {
    type: Number,
    default: 0,
  },
  hates: {
    type: Number,
    default: 0,
  },
  media: {
    type: {
      type: String,
      enum: ["image", "gif"],
      default: null,
    },
    src: {
      type: String,
      default: null,
    },
  },
  userInteractions: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      action: { type: String, enum: ["like", "hate"] },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

commentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Comment = models.Comment || model("Comment", commentSchema);
export default Comment;
