const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
    },
    profile_picture: {
      type: String,
      default: null,
      maxlength: 255,
    },
    bio: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema); // Ensure this line is correct
module.exports = User; // Correctly exporting the model
