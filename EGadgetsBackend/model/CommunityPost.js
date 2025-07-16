// models/CommunityPost.js
const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 255,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CommunityPost = mongoose.model("CommunityPost", communityPostSchema);

module.exports = CommunityPost;
