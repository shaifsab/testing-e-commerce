const mongoose = require("mongoose");

// Define the schema for an order item
const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId, // Refers to the Product model
    ref: "Product", // This links the OrderItem to a Product
    required: true, // Ensures the product is required for each order item
  },
  quantity: {
    type: Number, // The quantity of the product being ordered
    required: true, // Quantity is required
    min: 1, // Ensures quantity cannot be less than 1
  },
  selectedVariants: [
    {
      variantType: String, // Type of the variant (e.g., 'color', 'size')
      option: String, // The specific option selected (e.g., 'Red', 'M')
    },
  ],
  price: {
    type: Number, // Price for this particular order item (calculated from base price and variant prices)
    required: true, // Price is required for each order item
  },
});

// Define the order schema
const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Refers to the User model
      required: true, // Ensures a user is associated with the order
      ref: "User",
    },
    orderItems: [OrderItemSchema], // Array of items in the order, based on the OrderItemSchema
    shippingAddress: {
      address: { type: String, required: true }, // Shipping address for the order
    },
    phone: {
      type: String, // The phone number for contacting the customer
      required: true, // Phone number is required
    },
    status: {
      type: String, // The current status of the order
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"], // Valid statuses for the order
      default: "pending", // Default status is 'pending'
    },
    paymentResult: {
      id: { type: String }, // Payment ID from the payment gateway
      status: {
        type: String, // The status of the payment
        default: "pending", // Default payment status
        enum: ["pending", "complete"], // Valid payment statuses
      },
      update_time: { type: String }, // Timestamp of when the payment status was last updated
    },
    totalPrice: { type: Number, required: true }, // The total price of the order
    isPaid: { type: Boolean, default: false }, // Whether the order has been paid
    paidAt: { type: Date }, // Date and time when the payment was made
    isDelivered: { type: Boolean, default: false }, // Whether the order has been delivered
    deliveredAt: { type: Date }, // Date and time when the order was delivered
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId, // Refers to the User model for who last updated the order
      ref: "User",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

// Export the Order model
module.exports = mongoose.model("Order", orderSchema);
