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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

commentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Comment = models.Comment || model("Comment", commentSchema);
export default Comment;
