const express = require("express");  
const { createCategory, retrieveAllCategories,} = require("../../controllers/categoryController");

const upload = require("../../helpers/multerConfig"); 
const RoleCheck = require("../../middleware/roleMiddleware");  
const authMiddleware = require("../../middleware/authMiddleware"); 

const {createProduct,updateProduct,getAllProducts,deleteProduct,} = require("../../controllers/productController");

const router = express.Router(); 

// Route to create a new category
router.post( "/createcategory",upload.single("category"), createCategory);

// Route to retrieve all categories
router.get("/categories", retrieveAllCategories);

// Route to create a new product
router.post(
  "/create",  upload.fields([ 
    { name: "mainImg", maxCount: 1 }, 
    { name: "images", maxCount: 8 }, 
  ]),
  createProduct  
);

// Route to update an existing product
router.post(
  "/update/:slug",  
  upload.fields([
    { name: "mainImg", maxCount: 1 },
    { name: "images", maxCount: 8 },
  ]),
  updateProduct 
);

router.get("/productlist", getAllProducts);

// Route to delete a product
router.delete(
  "/deleteproduct/:productID", authMiddleware, RoleCheck(["admin"]), deleteProduct  
);

// Export the router for use in the app
module.exports = router;
