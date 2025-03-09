const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png"],
  },
});

// const upload = multer({ storage: storage });
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
}).array("file", 4);

// const handleUploadError = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return res.status(500).json({ error: err.message });
//   } else if (err) {
//     return res.status(500).json({ error: "Unknown error occurred during file upload" });
//   }
//   next();
// };

module.exports = upload;



