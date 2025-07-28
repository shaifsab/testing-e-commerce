// Import Express and required route modules
const express = require('express');
const router = express.Router();

// Import route modules for different functionalities
const authRoute = require("./authRoutes");       // Authentication routes
const productRoute = require("./productRoutes"); // Product-related routes
const orderRoute = require("./orderRoutes");     // Order-related routes

// Use authentication routes under the /auth path
router.use("/auth", authRoute);

// Use product routes under the /product path
router.use("/product", productRoute);

// Use order routes under the /order path
router.use("/order", orderRoute);

// Export the router to be used in the main app
module.exports = router;
