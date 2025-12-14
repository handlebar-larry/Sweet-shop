const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.route");
const sweetRoutes = require("./routes/sweet.route");

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use("/uploads", express.static("uploads"));

  app.use("/api", userRoutes);
  app.use("/api/sweets", sweetRoutes);

  // basic health check
  app.get("/", (req, res) => {
    res.status(200).json({ status: "ok", service: "sweetcorner-backend" });
  });

  return app;
};

module.exports = createApp;
