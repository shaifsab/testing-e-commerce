const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Cart Schema Definition
const cartSchema = new Schema(
  {
    // User associated with the cart
    user: {
      type: Schema.Types.ObjectId,  
      ref: "User",  
      required: true,  
    },

    // Items in the cart (array of products)
    items: [
      {
        // Product associated with this item in the cart
        product: {
          type: Schema.Types.ObjectId,  
          ref: "Product",  
          required: true, 
        },
        // Quantity of the product in the cart
        quantity: {
          type: Number,  
          default: 1,  
          min: 1, 
        },
      },
    ],
  },
  {
    // Enable automatic creation of timestamps (createdAt, updatedAt)
    timestamps: true,
  }
);

// Export the Cart model
module.exports = mongoose.model("Cart", cartSchema);
