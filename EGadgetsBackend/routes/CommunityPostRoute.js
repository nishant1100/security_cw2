// routes/communityPostRoutes.js
const express = require("express");
const { addCommunityPost, getAllPosts, getPostById, deleteCommunityPost } = require("../controller/CommunityPostController");
const router = express.Router();

// Add a community post
router.post("/add", addCommunityPost);

// Get all community posts
router.get("/", getAllPosts);

// Get a community post by ID
router.get("/:id", getPostById);

// Delete a community post by ID
router.delete("/:id", deleteCommunityPost);

module.exports = router;
