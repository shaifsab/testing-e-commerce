// Import Express and required controllers, middleware, and upload configuration
const express = require("express");
const {
  createNewCategory, // Creates a new category
  retrieveAllCategories, // Retrieves all categories
} = require("../../controllers/categoryController");
const upload = require("../../helpers/multerConfig");
const checkUserRole = require("../../middleware/roleMiddleware");
const authMiddleware = require("../../middleware/authMiddleware");
const { createNewProduct } = require("../../controllers/productController");
const router = express.Router();

// Route to create a new category with image upload
router.post("/create_category",authMiddleware, checkUserRole(["admin"]), upload.single("category"), createNewCategory)
router.get("/categories",authMiddleware, checkUserRole(["users", "admin", "stuffs"]), retrieveAllCategories)

module.exports = router;