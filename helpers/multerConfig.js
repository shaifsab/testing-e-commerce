const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + "profile";
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const configureMulter = multer({ storage: storage });

module.exports = configureMulter;