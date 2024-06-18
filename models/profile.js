import { Schema, model, models } from "mongoose";

const UserProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    trim: true,
    default: "",
  },
  background: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 200,
    default: "",
  },
  location: {
    type: String,
    trim: true,
    default: "",
  },
  interests: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
    },
  ],
});

// Create a pre-save hook to update the updatedAt field
UserProfileSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const UserProfile =
  models.UserProfile || model("UserProfile", UserProfileSchema);

export default UserProfile;
