import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Routes
import bookingRoutes from "./routes/bookingRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import sparePartRoutes from "./routes/sparePartRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

// Load env variables
dotenv.config();

// ES module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App init
const app = express();

// =====================
// Middleware
// =====================
app.use(
  cors({
    origin: [
      "http://localhost:5173",                  // local frontend
      "https://primeauto-frontend.onrender.com" // deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// =====================
// Base Routes
// =====================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PrimeAuto Backend is running 🚀"
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Vehicle Service Management System API",
    endpoints: [
      "/api/health",
      "/api/services",
      "/api/bookings",
      "/api/spare-parts",
      "/api/auth",
      "/api/users",
      "/api/orders",
      "/api/cart",
      "/api/categories",
      "/api/admin",
      "/api/dashboard"
    ]
  });
});

// =====================
// API Routes
// =====================
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/spare-parts", sparePartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);

// =====================
// Health Check
// =====================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    message: "Backend is running successfully",
    time: new Date().toISOString()
  });
});

// =====================
// 404 Handler
// =====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// =====================
// Error Handler
// =====================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  process.exit(1);
});

startServer();

export default app;
