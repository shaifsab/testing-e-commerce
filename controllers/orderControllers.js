// Import necessary models
const orderSchema = require("../models/orderSchema");
const productSchema = require("../models/productSchema");

// Add a new order
const addNewOrder = async (req, res) => {
  // Destructure required fields from the request body
  const { items, shippingAddress, phone } = req.body;

  // Validate the required fields
  if (!items || items.length < 1) {
    return res.status(400).send("Product is required");
  }
  if (!shippingAddress) {
    return res.status(400).send("Address is required");
  }
  if (!phone) {
    return res.status(400).send("Phone number is required");
  }

  let totalAmount = 0; // Initialize total amount to zero
  const populatedItems = []; // This array is currently unused but can be helpful for item details

  // Iterate over each item in the order
  for (const item of items) {
    // Fetch the product using the productId from the database
    const product = await productSchema.findById(item.productId);
    
    // If the product is not found, return a 404 error
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let itemPrice = product.price; // Initialize the item price with the base product price

    // Add the additional price based on selected variants
    item.selectedVariants.forEach((variant) => {
      // Find the variant from the product's variant list
      const productVariant = product.varients.find((v) => v.name === variant.name);
      
      if (productVariant) {
        // Find the matching option from the selected variant
        const matchedOption = productVariant.options.find((opt) => {
          return opt.size === variant.option;
        });
        
        // If a matching option is found, add its additional price
        if (matchedOption) {
          itemPrice += matchedOption.additionalPrice;
          item.price = itemPrice; // Update item price with additional price
        }
      }
    });

    // Accumulate the total price for the order (item price * quantity)
    totalAmount += itemPrice * item.quantity;
  }

  // Create a new order object
  const order = new orderSchema({
    orderItems: items, // The list of ordered items
    user: req.user._id, // The user who placed the order
    shippingAddress, // Shipping address for the order
    totalPrice: totalAmount, // Total price of the order
  });

  // Save the created order to the database
  const createdOrder = await order.save();

  // Respond with the created order object
  res.status(201).json(createdOrder);
};

// Export the addNewOrder function for use in routes
module.exports = { addNewOrder };
