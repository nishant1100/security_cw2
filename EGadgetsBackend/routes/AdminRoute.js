const express =  require('express');
const Admin = require('../model/Admin');
const jwt = require('jsonwebtoken');

const router =  express.Router();
const bcrypt = require('bcryptjs');
const JWT_SECRET = "80ce475b473a1605178f5371eb112e92d42fc0c521dfb2a6f01ffa60568dabc32";

// ✅ Admin Register Route (add this!)
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = new Admin({
      username,
      password,
      role: "admin"
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.error("Admin registration failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/admin", async (req, res) => {
    const {username, password} = req.body;
    try {
        const admin =  await Admin.findOne({username});
        
        if(!admin) {
            res.status(404).send({message: "Admin not found!"})
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password!" });
        }

        
        const token =  jwt.sign(
            {id: admin._id, username: admin.username, role: admin.role}, 
            JWT_SECRET,
            {expiresIn: "1h"}
        )

        return res.status(200).json({
            message: "Authentication successful",
            token: token,
            user: {
                username: admin.username,
                role: admin.role
            }
        })
        
    } catch (error) {
       console.error("Failed to login as admin", error)
       res.status(401).send({message: "Failed to login as admin"}) 
    }
})

module.exports = router;