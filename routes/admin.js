const express = require("express");
const { Log, User } = require("../models");
const router = express.Router();

router.get("/logs", async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Log.findAndCountAll({
      limit,
      offset,
      order: [["timestamp", "DESC"]],
      include: [{ model: User, attributes: ["id", "email", "role"] }],
    });

    res.json({
      totalLogs: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      logs: rows,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching logs", error: error.message });
  }
});

module.exports = router;
