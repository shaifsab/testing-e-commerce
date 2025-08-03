// Import required models
const orderSchema = require("../models/orderSchema");
const productSchema = require("../models/productSchema");

// Function to add a new order
const addNewOrder = async (req, res) => {
  // Destructure data from the request body
  const { items, shippingAddress, phone } = req.body;

  // Validation: Ensure required fields are provided
  if (!items || items.length < 1)
    return res.status(400).send("Product is required");
  if (!shippingAddress) return res.status(400).send("Address is required");
  if (!phone) return res.status(400).send("Phone number is required");

  // Variable to keep track of the total order amount
  let totalAmount = 0;

  // Loop through each item in the order to calculate the total amount
  for (const item of items) {
    // Find the product by its ID
    const product = await productSchema.findById(item.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Start with the product's base price
    let itemPrice = product.price;

    // Check and add any additional price for selected variants
    item.selectedVariants.forEach((variant) => {
      const productVariant = product.varients.find(
        (v) => v.name === variant.name
      );
      if (productVariant) {
        const matchedOption = productVariant.options.find((opt) => {
          return opt.size === variant.option;
        });
        if (matchedOption) {
          itemPrice += matchedOption.additionalPrice;
          item.price = itemPrice; // Update item price with additional variant price
        }
      }
    });

    // Add the total price for this item (considering quantity)
    totalAmount += itemPrice * item.quantity;
  }

  // Create a new order object with the calculated values
  const order = new orderSchema({
    orderItems: items,
    user: req.user._id,
    shippingAddress,
    totalPrice: totalAmount,
  });

  // Save the new order to the database
  const createdOrder = await order.save();

  // Respond with the created order
  res.status(201).json(createdOrder);
};

// Function to update an existing order
const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;  // Get orderId from route parameters
    const { status } = req.body;     // Get status from request body

    let updateFields = {};  // Object to store fields to update

    // Validate status if provided
    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Update status if valid
    updateFields.status = status;

    // If the status is 'delivered', add delivery-specific fields
    if (status === "delivered") {
      updateFields.isDelivered = true;
      updateFields.deliveredAt = new Date.now();
    }

    updateFields.updatedBy = req.user.id;  // Log the user who updated the order

    // Fetch and update the order by orderId
    const order = await orderSchema.findByIdAndUpdate(orderId, updateFields);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Respond with the updated order
    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Export the functions for use in other modules
module.exports = { addNewOrder, updateOrder };
