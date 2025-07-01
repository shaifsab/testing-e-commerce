// Import Express and required route modules
const express = require('express');
const apiRoute = require('./api/index'); // API routes
const router = express.Router();

// Use API routes under the specified API route path from environment
router.use(process.env.API_ROUTE, apiRoute);

// Default route to welcome message
router.get("/", (req, res) => {
    res.send("Hello! Welcome to the server.");
});

// Middleware to handle 404 errors for undefined routes
router.use((req, res) => {
    res.status(404).send("Page not found!");
});

module.exports = router;