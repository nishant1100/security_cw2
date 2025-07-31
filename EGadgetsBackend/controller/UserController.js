const Credential = require("../model/Credentials");  
const findAll = async (req, res) => {
  try {
    const users = await Credential.find();  
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ error: "Error fetching users", message: e.message });
  }
};

const save = async (req, res) => {
  try {
    const user = new Credential(req.body); 
    await user.save();
    res.status(201).json(user);
  } catch (e) {
    console.error("Error saving user:", e);
    res.status(500).json({ error: "Error saving user", message: e.message });
  }
};

const findById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Credential.findById(id); 
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (e) {
    console.error("Error finding user by ID:", e);
    res.status(500).json({ error: "Error fetching user by ID", message: e.message });
  }
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Credential.findByIdAndDelete(id); 
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (e) {
    console.error("Error deleting user:", e);
    res.status(500).json({ error: "Error deleting user", message: e.message });
  }
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const user = await Credential.findByIdAndUpdate(id, updateData, { new: true }); // ✅ Use Credential model
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(201).json({ message: "User updated successfully", user });
  } catch (e) {
    console.error("Error updating user:", e);
    res.status(500).json({ error: "Error updating user", message: e.message });
  }
};

module.exports = {
  findAll,
  save,
  findById,
  deleteById,
  updateById
};
