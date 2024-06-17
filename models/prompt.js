import { Schema, model, models } from "mongoose";

const PromptSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  prompt: {
    type: String,
    required: [true, "Prompt is required."],
  },
  tag: {
    type: String,
    required: [true, "Tag is required."],
  },
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
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  userInteractions: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      action: { type: String, enum: ["like", "hate"] },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PromptSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Prompt = models.Prompt || model("Prompt", PromptSchema);

export default Prompt;
