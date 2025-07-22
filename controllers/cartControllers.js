const cartSchema = require("../models/cartSchema");

// Add product to cart
const addtocart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  // Validate that productId is provided
  if (!productId) {
    return res.status(400).send({ message: "Product data required!" });
  }

  try {
    // Find or create cart for the user
    let cart = await cartSchema.findOne({ user: req.user.id });

    if (!cart) {
      cart = new cartSchema({
        user: req.user.id,
        items: [],
      });
    }

    // Check if the product already exists in the cart
    const index = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (index > -1) {
      // Product is already in the cart, update quantity
      cart.items[index].quantity += quantity;
    } else {
      // New product, add to the cart
      cart.items.push({ product: productId, quantity });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).send({ message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// Update the quantity of a product in the cart
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // Validate input data
    if (!productId || quantity === undefined || quantity < 0) {
      return res
        .status(400)
        .json({ message: "Invalid product ID or quantity." });
    }

    // Find the user's cart
    let cart = await cartSchema.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Find the product in the cart
    const index = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (index === -1) {
      return res.status(404).json({ message: "Product not found in cart." });
    }

    // Update the quantity of the product
    cart.items[index].quantity = quantity;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Cart updated successfully.", cart });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove an item from the cart
const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    // Find the user's cart
    let cart = await cartSchema.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const initialLength = cart.items.length;

    // Remove the item from the cart
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    // Check if the item was found and removed
    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: "Product not found in cart." });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Item removed from cart.", cart });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get the user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Retrieve the cart and populate product details
    const cart = await cartSchema
      .findOne({ user: userId })
      .populate("items.product");

    res.status(200).json({ message: "Cart fetched successfully.", cart });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Export the functions
module.exports = { addtocart, updateCartItem, deleteCartItem, getCart };
