
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config(); // ✅ Load env vars early
const connectDB = require("./config/db");

// Import Routes
const UserRouter = require("./routes/userRoute");
const ProductRouter = require("./routes/ProductRoute");
const CommunityPostRoute = require("./routes/CommunityPostRoute");
const AuthRouter = require("./routes/AuthRoute");
const OrderRouter = require("./routes/OrderRoute");
const AdminRouter = require("./routes/AdminRoute");
const AdminRoutes2 = require("./stats/adminStats");
const cartRoutes = require("./routes/CartRoutes");
const esewaRoute = require('./routes/EsewaRoute');


// Initialize Express app
const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:5173", // Change if your frontend is hosted elsewhere
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json()); // Parse JSON requests
app.use(morgan("dev"));  // Log requests
app.use("/images", express.static(path.join(__dirname, "images"))); // Serve static images

// ✅ Routes
app.use("/api/user", UserRouter);
app.use("/api/product", ProductRouter);
app.use("/api/communityposts", CommunityPostRoute);
app.use("/api/auth", AuthRouter);
app.use("/api/orders", OrderRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/admin2", AdminRoutes2);
app.use("/api/cart", cartRoutes);
app.use('/api/esewa', esewaRoute);




// ✅ Start Server
const PORT = process.env.PORT || 3000;
console.log("Esewa route loaded:", esewaRoute.stack?.map(r => r.route?.path));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

module.exports = app;