const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: null
  },
  phone: {
    type: Number,
    required: true
  },
  avatar: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "stuff"]
  },
  otp: {
    type: String,
  },
  otpExpiredAt: {
    type: Date,
  },
  isVarified: {
    type: Boolean,
    default: false,
  },
  resetPassId: {
    type: String
  },
  resetPassExpiredAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);