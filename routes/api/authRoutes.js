// Import Express and required controllers, middleware, and upload configuration
const express = require("express");
const { registerUser, authenticateUser, verifyUserEmail, initiatePasswordReset, resetUserPassword, updateUserProfile} = require("../../controllers/authController");
const upload = require("../../helpers/multerConfig");
const authMiddleware = require("../../middleware/authMiddleware");
const checkUserRole = require("../../middleware/roleMiddleware");
const router = express.Router();

// Route for user registration
router.post("/registration", registerUser);
// Route for verifying user email
router.post("/verifyemail", verifyUserEmail);
// Route for user login
router.post("/login", authenticateUser);
// Route for initiating password reset
router.post("/forgetpass", initiatePasswordReset);
// Route for resetting password
router.post("/resetpassword/:randomstring", resetUserPassword);
// Route for updating user profile with authentication and role check
router.post("/update", authMiddleware, checkUserRole(["user", "admin", "stuff"]), upload.single('avatar'), updateUserProfile);

module.exports = router;