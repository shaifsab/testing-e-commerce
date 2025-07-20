const productSchema = require("../models/productSchema");
const cloudinary = require("../helpers/cloudinary");
const fs = require("fs");
const categorySchema = require("../models/categorySchema");
const slugGenerator = require("../helpers/productSlugGenerator");
const searchRegex = require("../helpers/searchRegex");

// Controller to create a new product
const createProduct = async (req, res) => {
  const { title, description, price, stock, category, variants } = req.body;

  try {
    // Validation for required fields
    if (!title) return res.status(400).send({ message: "Product name is required!" });
    if (!description) return res.status(400).send({ message: "Product description is required!" });
    if (!price) return res.status(400).send({ message: "Price is required!" });
    if (!stock) return res.status(400).send({ message: "Stock is required!" });
    if (!category) return res.status(400).send({ message: "Category is required!" });
    if (!req.files.mainImg) return res.status(400).send({ message: "Main image is required!" });

    const slug = slugGenerator(title); // Generate a slug for the product title

    const existingProduct = await productSchema.findOne({ slug: slug });
    if (existingProduct) return res.status(400).send({ message: "Product title already used." });

    // Validation for variants (color/size)
    variants.forEach((item) => {
      if (!["color", "size"].includes(item.name)) {
        return res.status(400).send({ message: "Invalid variant name, only 'color' and 'size' are allowed." });
      }

      if (item.name === "color") {
        item.options.forEach((colorOption) => {
          if (!colorOption.hasOwnProperty("colorname"))
            return res.status(400).send({ message: "In color variant, 'color name' is required." });
        });
      }

      if (item.name === "size") {
        item.options.forEach((sizeOption) => {
          if (!sizeOption.hasOwnProperty("size"))
            return res.status(400).send({ message: "In size variant, 'size' is required." });
        });
      }
    });

    // Upload main image
    let mainImg;
    for (let item of req.files.mainImg) {
      const result = await cloudinary.uploader.upload(item.path, { folder: "products" });
      fs.unlinkSync(item.path); // Remove local file after upload
      mainImg = result.url;
    }

    // Upload sub images
    let productImages = [];
    if (req.files.images.length > 0) {
      for (let item of req.files.images) {
        const result = await cloudinary.uploader.upload(item.path, { folder: "products" });
        fs.unlinkSync(item.path); // Remove local file after upload
        productImages.push(result.url);
      }
    }

    // Create and save product
    const product = new productSchema({
      title,
      description,
      slug,
      price,
      stock,
      category,
      variants,
      mainImg,
      images: productImages,
    });

    await product.save();
    res.status(201).send({ message: "Product created successfully.", product });
  } catch (error) {
    res.status(500).send({ error: "Server error!" });
  }
};

// Controller to update an existing product
const updateProduct = async (req, res) => {
  const { title, description, price, stock, category, variants, status } = req.body;
  const { slug } = req.params;

  try {
    const existingProduct = await productSchema.findOne({ slug: slug });
    if (!existingProduct) return res.status(400).send({ message: "Invalid request, no product found!" });

    // Update product fields
    if (title) existingProduct.title = title;
    if (description) existingProduct.description = description;
    if (price) existingProduct.price = price;
    if (stock) existingProduct.stock = stock;
    if (category) existingProduct.category = category;
    if (variants && variants.length > 0) existingProduct.variants = variants;

    // Status update (only admin can modify product status)
    if (status && ["active", "pending", "reject"].includes(status.toLowerCase())) {
      if (req.user.role === "admin") {
        existingProduct.status = status;
      }
    }

    // Handle main image upload
    if (req?.files?.mainImg?.length > 0) {
      let mainImg;
      for (let item of req.files.mainImg) {
        // Delete the old main image
        await cloudinary.uploader.destroy(existingProduct.mainImg.split("/").pop().split(".")[0]);
        const result = await cloudinary.uploader.upload(item.path, { folder: "products" });
        fs.unlinkSync(item.path); // Remove local file after upload
        mainImg = result.url;
      }
      existingProduct.mainImg = mainImg;
    }

    await existingProduct.save();
    res.status(200).send({ message: "Product updated successfully.", product: existingProduct });
  } catch (error) {
    res.status(500).send({ error: "Server error!" });
  }
};

// Controller to get all products with optional search, filters, and pagination
const getAllProducts = async (req, res) => {
  try {
    const search = req.query.search || "";
    const status = req.query.status || "";
    const categoryName = req.query.category || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalProducts = await productSchema.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);
    const skip = (page - 1) * limit;
    const query = {};

    // Apply search filter if provided
    if (search) {
      query.title = { $regex: searchRegex(search), $options: "i" };
    }
    if (status) query.status = status;

    // Apply category filter if provided
    if (categoryName) {
      const categoryData = await categorySchema.findOne({
        name: { $regex: searchRegex(categoryName), $options: "i" },
      });
      if (categoryData) query.category = categoryData._id;
    }

    const products = await productSchema
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate("category");

    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    res.send({
      products,
      totalProducts,
      limit,
      page,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
    });
  } catch (error) {
    res.status(500).send({ error: "Server error!" });
  }
};

// Controller to delete a product
const deleteProduct = async (req, res) => {
  const { productID } = req.params;

  try {
    const product = await productSchema.findByIdAndDelete(productID);
    if (!product) return res.status(400).send({ message: "No product found." });
    res.status(200).send({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).send({ error: "Server error!" });
  }
};

module.exports = {
  createProduct, updateProduct, getAllProducts, deleteProduct,
};
