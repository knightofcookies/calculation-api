const jwt = require("jsonwebtoken");
const { User } = require("../models");

/**
 * Middleware to authenticate a token.
 * Verifies the JWT from the Authorization header.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userData) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }

    try {
      const user = await User.findByPk(userData.id);
      if (!user) {
        return res.status(403).json({ message: "User not found." });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ message: "Error fetching user data." });
    }
  });
};

/**
 * Middleware factory to check for a specific role.
 * @param {string} role - The role to check for ('admin' or 'user').
 * @returns {function} Express middleware function.
 */
const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res
        .status(403)
        .json({ message: `Access denied. Requires ${role} role.` });
    }
  };
};

module.exports = { authenticateToken, checkRole };
