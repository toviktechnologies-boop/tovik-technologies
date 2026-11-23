
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";

import { addEnquiry, getEnquiries } from "./store.js";
import { requireAdmin } from "./auth.js";

const app = express();
const port = Number(process.env.PORT || 5000);

if (!process.env.JWT_SECRET) {
  if (process.env.VERCEL) {
    throw new Error("JWT_SECRET must be configured in Vercel.");
  }

  console.warn("WARNING: Using a local development JWT secret.");
  process.env.JWT_SECRET = "local-development-secret-change-before-deployment";
}

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
  })
);

app.use(express.json({ limit: "30kb" }));

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message: "Too many submissions. Please try again later."
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "TOVIK Technologies API"
  });
});

// Submit enquiry
app.post("/api/enquiries", enquiryLimiter, async (req, res, next) => {
  try {
    const { name, email, service, message } = req.body || {};

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 80
    ) {
      return res.status(400).json({
        message: "Please enter a name between 2 and 80 characters."
      });
    }

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 160
    ) {
      return res.status(400).json({
        message: "Please enter a valid email address."
      });
    }

    if (typeof service !== "string" || service.length > 100) {
      return res.status(400).json({
        message: "Please choose a service."
      });
    }

    if (
      typeof message !== "string" ||
      message.trim().length < 10 ||
      message.trim().length > 3000
    ) {
      return res.status(400).json({
        message: "Please provide a message between 10 and 3000 characters."
      });
    }

    const enquiry = await addEnquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      service: service.trim(),
      message: message.trim()
    });

    res.status(201).json({
      message: "Enquiry received.",
      id: enquiry.id
    });
  } catch (error) {
    next(error);
  }
});

// Admin login
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body || {};

  const adminEmail = process.env.ADMIN_EMAIL || "admin@tovik.in";
  const adminPassword = process.env.ADMIN_PASSWORD || "Tovik@12345";

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({
      message: "Incorrect email or password."
    });
  }

  const token = jwt.sign(
    { role: "admin", email: adminEmail },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    token,
    email: adminEmail
  });
});

// Admin enquiries
app.get("/api/admin/enquiries", requireAdmin, async (_req, res, next) => {
  try {
    res.json({
      enquiries: await getEnquiries()
    });
  } catch (error) {
    next(error);
  }
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error("TOVIK API ERROR:", err);

  res.status(500).json({
    message: "Something went wrong on the server."
  });
});

// Local development server
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`TOVIK API running at http://localhost:${port}`);
  });
}

// Export Express app for Vercel
export default app;
