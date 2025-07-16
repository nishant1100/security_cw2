const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

const Verification = mongoose.model("verifications", verificationSchema);
module.exports = Verification;
