const express = require("express");

// Controllers
const { 
  createCategory, 
  retrieveAllCategories 
} = require("../../controllers/categoryController");

const { 
  createProduct, 
  updateProduct, 
  getAllProducts, 
  deleteProduct 
} = require("../../controllers/productController");

const { 
  addtocart, 
  updateCartItem, 
  deleteCartItem, 
  getCart 
} = require("../../controllers/cartControllers");

// Helper and middleware imports
const upload = require("../../helpers/multerConfig"); 
const RoleCheck = require("../../middleware/roleMiddleware");  
const authMiddleware = require("../../middleware/authMiddleware"); 

// Initialize router instance
const router = express.Router();
 
//  CATEGORY ROUTES

// Route to create a new category with an image
router.post("/create-category", upload.single("category"), createCategory);

// Route to retrieve all categories
router.get("/categories", retrieveAllCategories);


//  PRODUCT ROUTES

// Route to create a new product with images
router.post("/create", upload.fields([
  { name: "mainImg", maxCount: 1 },  // Single main product image
  { name: "images", maxCount: 8 },   // Up to 8 additional product images
]), createProduct);

// Route to update an existing product
router.post("/update/:slug", upload.fields([
  { name: "mainImg", maxCount: 1 },  // Single main product image
  { name: "images", maxCount: 8 },   // Up to 8 additional product images
]), updateProduct);

// Route to get all products
router.get("/product-list", getAllProducts);

// Route to delete a product by its ID
router.delete("/delete-product/:productID", authMiddleware, RoleCheck(["admin"]), deleteProduct);


//  CART ROUTES
router.post("/add-to-cart", authMiddleware, addtocart);
router.put("/update-cart", authMiddleware, updateCartItem);
router.delete("/delete-cart-item/:productId", authMiddleware, deleteCartItem);
router.get("/get-cart", authMiddleware, getCart);



module.exports = router;
