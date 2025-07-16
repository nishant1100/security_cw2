const mongoose = require ("mongoose")

const connectDB = async () =>{
    try{
        await mongoose.connect("mongodb://localhost:27017/SonicSummit")
        console.log("MongoDB connected")
    }
    catch(e){
        console.log("MongoDB not Connected")
    }
}

module.exports = connectDB;