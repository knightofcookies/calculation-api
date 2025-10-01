require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const { sequelize } = require("./models");
const { authenticateToken, checkRole } = require("./middleware/auth");
const dbLogger = require("./middleware/logger");
const swaggerSpec = require("./swaggerDef");

const authRoutes = require("./routes/auth");
const calculationRoutes = require("./routes/calculations");
const adminRoutes = require("./routes/admin");

const app = express();
const port = process.env.PORT || 3579;

app.use(express.json());
app.use(dbLogger);

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Public Routes
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Numerical Calculations API! Visit /api-docs for documentation.",
  );
});
app.use("/auth", authRoutes);

// Protected Routes
app.use("/calc", authenticateToken, calculationRoutes);
app.use("/admin", authenticateToken, checkRole("admin"), adminRoutes);

// Server Initialization
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    await sequelize.sync({ alter: true }); // Use {force: true} to drop and recreate tables
    console.log("All models were synchronized successfully.");

    // Create a default admin user if one doesn't exist
    const { User } = require("./models");
    const admin = await User.findOne({
      where: { email: process.env.DEFAULT_ADMIN_EMAIL },
    });
    if (!admin) {
      await User.create({
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: process.env.DEFAULT_ADMIN_PASSWORD,
        role: "admin",
      });
      console.log("Default admin user created.");
    }

    if (process.env.NODE_ENV !== "test") {
      app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
      });
    }
  } catch (error) {
    console.error("Unable to connect to the database or start server:", error);
  }
};

startServer();

// Export the app for testing purposes
module.exports = app;
