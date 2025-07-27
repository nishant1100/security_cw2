// const mongoose = require ("mongoose")

// const connectDB = async () =>{
//     try{
//         await mongoose.connect("mongodb://localhost:27017/SonicSummit")
//         console.log("MongoDB connected")
//     }
//     catch(e){
//         console.log("MongoDB not Connected")
//     }
// }

// module.exports = connectDB;

const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/SonicSummit")
        console.log("✅ MongoDB connected");
    } catch (e) {
        console.error("❌ MongoDB connection error:", e.message);
    }
};

module.exports = connectDB;