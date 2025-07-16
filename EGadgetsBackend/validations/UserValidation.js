const joi = require("joi");
const User = require("../model/User");

const userSchemaValidation = joi.object({
  username: joi.string().max(50).required().messages({
    "string.base": "Username must be a string.",
    "string.max": "Username cannot exceed 50 characters.",
    "any.required": "Username is required.",
  }),
  email: joi.string().email().max(100).required().messages({
    "string.email": "Email must be a valid email address.",
    "string.max": "Email cannot exceed 100 characters.",
    "any.required": "Email is required.",
  }),
  profile_picture: joi.string().uri().allow(null).max(255).messages({
    "string.uri": "Profile picture must be a valid URL.",
    "string.max": "Profile picture URL cannot exceed 255 characters.",
  }),
  bio: joi.string().allow(null).messages({
    "string.base": "Bio must be a string.",
  }),
});

async function UserValidation(req, res, next) {
  const { username, email, profile_picture, bio } = req.body;

  const { error } = userSchemaValidation.validate({
    username,
    email,
    profile_picture,
    bio,
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username already exists." });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email already exists." });
      }
    }

    next();
  } catch (dbError) {
    console.error("Error checking username/email existence:", dbError);
    res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = UserValidation;
