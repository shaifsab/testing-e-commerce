
const express = require("express");
const { 
  createCategory, 
  getCategories 
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

// Import middleware for file upload, authentication, and role checking
const upload = require("../../helpers/multer");
const RoleCheck = require("../../middleware/roleMiddleware");  
const authMiddleware = require("../../middleware/authMiddleware"); 

const router = express.Router();



// Category Routes
router.post(
  "/createcategory",  
  upload.single("category"), 
  createCategory 

// Route to retrieve all categories
router.get("/categories", getCategories); 

// Product Routes
router.post(
  "/create", 
  upload.fields([  
    { name: "mainImg", maxCount: 1 }, 
    { name: "images", maxCount: 8 }, 
  createProduct 

// Route to update an existing product
router.post(
  "/update/:slug",
  upload.fields([ 
    { name: "mainImg", maxCount: 1 }, 
  ]),
  updateProduct  
);

// Route to retrieve a list of products
router.get("/productlist", getAllProducts);  

router.delete(
  "/deleteproduct/:productID",  
  authMiddleware, 
  RoleCheck(["admin"]), 
  deleteProduct  
);

// Cart Routes
router.post("/addtocart", authMiddleware, addtocart);
router.put("/updatecart", authMiddleware, updateCartItem); 
router.delete("/deletecartitem/:productId", authMiddleware, deleteCartItem);
router.get("/getcart", authMiddleware, getCart);


module.exports = router;
