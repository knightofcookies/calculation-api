const express = require("express");
const router = express.Router();

const validateNumbers = (req, res, next) => {
  const numbers = Object.values(req.query).map(parseFloat);
  if (numbers.some(isNaN)) {
    return res.status(400).json({ message: "Invalid number provided." });
  }
  next();
};

router.get("/add", validateNumbers, (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  res.json({ result: a + b });
});

router.get("/multiply", validateNumbers, (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  res.json({ result: a * b });
});

router.get("/isOdd", validateNumbers, (req, res) => {
  const n = parseFloat(req.query.n);
  res.json({ result: n % 2 !== 0 });
});

router.get("/isEven", validateNumbers, (req, res) => {
  const n = parseFloat(req.query.n);
  res.json({ result: n % 2 === 0 });
});

module.exports = router;
