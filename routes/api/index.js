// Import Express and required route modules
const express = require('express');
const router = express.Router();
const authRoute = require("./authRoutes"); // Authentication routes
const productRoute = require("./productRoutes"); // Product-related routes

// Use authentication routes under /auth path
router.use("/auth", authRoute);
// Use product routes under /product path
router.use("/product", productRoute);

module.exports = router;