const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// Define the user schema
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true, // Full name is required
    },
    email: {
      type: String,
      required: true, // Email is required
      unique: true, // Email must be unique in the collection
    },
    password: {
      type: String,
      required: true, // Password is required
    },
    address: {
      type: String,
      default: null, // Default value is null if not provided
    },
    phone: {
      type: Number,
      required: true, // Phone number is required
    },
    avatar: {
      type: String,
      default: "", // Default is an empty string for avatar
    },
    role: {
      type: String,
      default: "user", // Default role is 'user'
      enum: ["user", "admin", "stuff"], // Valid roles: 'user', 'admin', 'stuff'
    },
    otp: {
      type: String, // OTP for account verification or reset
    },
    otpExpiredAt: {
      type: Date, // Expiry date for OTP
    },
    isVarified: {
      type: Boolean,
      default: false, // Default value is false, indicating the account is not verified
    },
    resetPassId: {
      type: String, // ID for resetting the password
    },
    resetPassExpiredAt: {
      type: Date, // Expiry date for the password reset request
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Pre-save hook to hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  // If password is not modified, skip hashing
  if (!this.isModified("password")) return next();

  // Hash the password with bcrypt (salt rounds = 10)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if the provided password matches the stored password
userSchema.methods.isPasswordValid = async function (password) {
  // Compare the provided password with the hashed password stored in the database
  return await bcrypt.compare(password, this.password);
};

// Export the User model
module.exports = mongoose.model("User", userSchema);
