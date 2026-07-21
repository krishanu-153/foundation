import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminProfileRoutes from "./routes/adminProfileRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import causeRoutes from "./routes/causeRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";

connectDB();

const app = express();

// use this 
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sadhana Foundation API is running 🚀",
  });
});
app.get("/api/health", (req, res) => res.json({ success: true, message: "API is running" }));

// Public/user-facing auth
app.use("/api/auth", authRoutes);
// Admin auth
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/profile", adminProfileRoutes);

// Resource routes (each contains both public + /admin sub-routes)
app.use("/api/events", eventRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/causes", causeRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/settings", settingsRoutes);

// Admin dashboard (stats/charts) + logged-in user dashboard
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
