const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const asyncHandler = require("express-async-handler");

// Multer storage configuration
const storage = multer.memoryStorage();

// Multer file filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload only images."), false);
  }
};

// Multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

// Middleware to resize house photos
const resizeHousePhoto = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }
  req.body.images = [];
  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `house-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize({ width: 500, height: 500, fit: "fill" })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(path.resolve("uploads/house", filename));
      req.body.images.push(filename);
    })
  );
  next();
});

// Middleware to resize user photo
const resizeUserPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const filename = `user-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize({ width: 450, height: 450, fit: "fill" })
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.resolve("uploads/user", filename));
  req.body.image = filename;
  next();
});

// Multer upload instances
const uploadHousePhoto = upload.array("image", 3);
const uploadUserPhoto = upload.single("image");

module.exports = {
  uploadUserPhoto,
  resizeUserPhoto,
  uploadHousePhoto,
  resizeHousePhoto,
}; 


