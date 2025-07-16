// controller/CommunityPostController.js
const CommunityPost = require("../model/CommunityPost");
const User = require("../model/User");

// Add a community post
const addCommunityPost = async (req, res) => {
  try {
    const { user_id, title, content } = req.body;

    // Check if the user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the new post
    const post = new CommunityPost({
      user_id,
      title,
      content,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error adding community post:", error);
    res
      .status(500)
      .json({ error: "Error adding community post", message: error.message });
  }
};

// Get all community posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate("user_id", "username")
      .exec();
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No community posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching community posts:", error);
    res
      .status(500)
      .json({
        error: "Error fetching community posts",
        message: error.message,
      });
  }
};

// Get a community post by ID
const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await CommunityPost.findById(id)
      .populate("user_id", "username")
      .exec();
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching community post by ID:", error);
    res
      .status(500)
      .json({ error: "Error fetching community post", message: error.message });
  }
};

// Delete a community post by ID
// Delete a community post by ID
const deleteCommunityPost = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the post exists
    const post = await CommunityPost.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Delete the post using deleteOne instead of remove
    await CommunityPost.deleteOne({ _id: id });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting community post:", error);
    res
      .status(500)
      .json({ error: "Error deleting community post", message: error.message });
  }
};

module.exports = {
  addCommunityPost,
  getAllPosts,
  getPostById,
  deleteCommunityPost,
};
