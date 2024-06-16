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
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  userInteractions: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      action: { type: String, enum: ["like", "hate"] },
    },
  ],
});

const Prompt = models.Prompt || model("Prompt", PromptSchema);

export default Prompt;
