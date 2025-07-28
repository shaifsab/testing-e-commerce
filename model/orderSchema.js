const mongoose = require("mongoose");

// Schema for individual items in an order
const OrderItemSchema = new mongoose.Schema({
  // The product that is ordered, referenced from the Product model
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to Product model
    required: true,  // The product is mandatory
  },
  
  // Quantity of the product ordered
  quantity: {
    type: Number,
    required: true, // The quantity is mandatory
    min: 1,         // Quantity must be at least 1
  },
  
  // Selected variants of the product, such as color or size
  selectedVariants: [
    {
      variantType: String, // Type of variant (e.g., color, size)
      option: String,      // Selected option for that variant (e.g., 'Red', 'M')
    },
  ],
  
  // Price of the item, including base price and any additional costs from variants
  price: {
    type: Number,         // The price should be a number
    required: true,       // The price is mandatory
  },
});

// Main order schema
const orderSchema = mongoose.Schema(
  {
    // The user who placed the order, referenced from the User model
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,      // The user is mandatory for the order
      ref: "User",         // Reference to the User model
    },
    
    // Array of items in the order, using the OrderItemSchema
    orderItems: [OrderItemSchema],
    
    // Shipping address for the order
    shippingAddress: {
      address: { type: String, required: true }, // Address is mandatory
    },
    
    // Phone number of the user for delivery contact
    phone: {
      type: String,
      required: true, // Phone number is mandatory
    },
    
    // Order status with predefined possible values
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"], // Valid status values
      default: "pending",  // Default status is 'pending'
    },
    
    // Payment result details, including status and update time
    paymentResult: {
      id: { type: String },      // Payment ID
      status: {
        type: String,
        default: "pending",     // Default payment status is 'pending'
        enum: ["pending", "complete"],  // Valid payment statuses
      },
      update_time: { type: String }, // Time when payment was updated
    },
    
    // Total price of the order, including all items and additional costs
    totalPrice: { type: Number, required: true },
    
    // Boolean indicating whether the order has been paid
    isPaid: { type: Boolean, default: false },
    
    // Date when payment was made (if applicable)
    paidAt: { type: Date },
    
    // Boolean indicating whether the order has been delivered
    isDelivered: { type: Boolean, default: false },
    
    // Date when the order was delivered (if applicable)
    deliveredAt: { type: Date },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Export the Order model
module.exports = mongoose.model("Order", orderSchema);
