// Load environment variables
require("dotenv").config();
// Import required modules
const express = require("express");
const dbConfig = require("./config/dbConfig"); // Database configuration
const router = require("./routes"); // Main router
const cors = require("cors"); // CORS middleware
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to enable CORS
app.use(cors());

// Initialize database connection
dbConfig();

// Use the main router for all routes
app.use(router);

// Start the server on port 8000
app.listen(8000, () => console.log("Server is running"));