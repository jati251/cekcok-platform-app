import { Schema, model, models } from 'mongoose';

const PromptSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required.'],
  },
  tag: {
    type: String,
    required: [true, 'Tag is required.'],
  },
  likes: {
    type: String,
    required: [true, 'Likes is required.'],
  },
  hates: {
    type: String,
    required: [true, 'Hates is required.'],
  },
  comments: {
    type: String,
    required: [true, 'Comments is required.'],
  }
});

const Prompt = models.Prompt || model('Prompt', PromptSchema);

export default Prompt;