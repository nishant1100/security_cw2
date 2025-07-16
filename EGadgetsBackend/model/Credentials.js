const mongoose = require("mongoose");

const credSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    bio: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Credential = mongoose.model("creds", credSchema);

module.exports = Credential;
