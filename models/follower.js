import { Schema, model, models } from "mongoose";

const FollowerSchema = new Schema({
  follower: { type: Schema.Types.ObjectId, ref: "UserProfile", required: true },
  following: {
    type: Schema.Types.ObjectId,
    ref: "UserProfile",
    required: true,
  },
  followedAt: { type: Date, default: Date.now },
});

const Follower = models.Follower || model("Follower", FollowerSchema);

export default Follower;
